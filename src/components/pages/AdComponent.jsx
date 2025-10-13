import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';
import { getVastAd } from '../../services/channelData.service';
import { buildVastUrl } from '../../utils/vastUrl.util';
import { getAllDeviceInfo } from '../../utils/deviceInfo.util';

const AdComponent = ({ videoData, onNormalAdCompleted }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hasInitialized = useRef(false);
  const isDisposed = useRef(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const randomCB = Math.floor(Math.random() * 100000);
  const appstoreUrl = process.env.REACT_APP_FIRETV_APPSTORE_URL;
  const appChannelName = process.env.REACT_APP_FIRETV_CHANNEL_NAME;
  const userInteracted = sessionStorage.getItem('user_interacted');

  useEffect(() => {
    // Fetch device info first
    const loadDeviceInfo = async () => {
      const info = await getAllDeviceInfo();
      setDeviceInfo(info);
    };
    loadDeviceInfo();
  }, []);

  useEffect(() => {
    if (!deviceInfo || hasInitialized.current) return;

    hasInitialized.current = true;
    const playerContainer = videoRef.current;

    // Block arrow key navigation
    const blockArrowKeys = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    playerContainer?.addEventListener('keydown', blockArrowKeys);

    const fetchAndInitAd = async () => {
      try {
        const vastUrls = buildVastUrl({
          deviceInfo,
          videoData,
          randomCB,
          appstoreUrl,
          appChannelName,
        });
        const vast_url_api = await getVastAd(vastUrls);
        const vastURL = vast_url_api.content?.vast_url;
        if (!vastURL) {
          // console.error('No VAST URL provided.');
          onNormalAdCompleted();
          return;
        }
        const response = await fetch(vastURL);
        if (!response.ok) {
          // console.error('Failed to fetch VAST config:', response.statusText);
          onNormalAdCompleted();
          return;
        }
        const vastXML = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(vastXML, 'application/xml');

        const mediaFiles = xmlDoc.querySelectorAll('Creative > Linear > MediaFiles > MediaFile');
        const duration = xmlDoc.querySelector('Creative > Linear > Duration')?.textContent;

        let selectedMediaFile = null;
        let mediaType = 'video/mp4';
        let adMediaUrl = '';
        let maxResolution = 0;
        let maxBitrate = 0;

        // Select highest quality MediaFile based on resolution and bitrate
        for (const mediaFile of mediaFiles) {
          const height = parseInt(mediaFile.getAttribute('height') || '0', 10);
          const width = parseInt(mediaFile.getAttribute('width') || '0', 10);
          const bitrate = parseInt(mediaFile.getAttribute('bitrate') || '0', 10);
          const fileType = mediaFile.getAttribute('type') || 'video/mp4';
          const resolution = width * height;

          // Prefer HLS/DASH for adaptive quality, then prioritize by resolution and bitrate
          if (
            (fileType === 'application/x-mpegURL' || fileType === 'application/dash+xml') ||
            (resolution > maxResolution) ||
            (resolution === maxResolution && bitrate > maxBitrate)
          ) {
            selectedMediaFile = mediaFile;
            mediaType = fileType;
            maxResolution = resolution;
            maxBitrate = bitrate;
          }
        }

        // Fallback to first MediaFile if none selected
        if (!selectedMediaFile && mediaFiles.length > 0) {
          selectedMediaFile = mediaFiles[0];
          mediaType = selectedMediaFile.getAttribute('type') || 'video/mp4';
          // console.warn('No high-quality media file found, using default media file.');
        }

        if (selectedMediaFile && duration && videoRef.current) {
          adMediaUrl = selectedMediaFile.textContent.trim();
          const [hours, minutes, seconds] = duration.trim().split(':').map(parseFloat);
          const totalDurationSeconds = hours * 3600 + minutes * 60 + seconds;

          // Initialize Video.js player
          const player = videojs(videoRef.current, {
            controls: false,
            autoplay: true,
            preload: 'auto',
            sources: [{ src: adMediaUrl, type: mediaType }],
            fluid: true,
            responsive: true,
            aspectRatio: '16:9',
          });

          // If first-time, wait for user gesture to unmute
          playerRef.current = player;
          const unmuteOnGesture = async () => {
            if (playerRef.current && !isDisposed.current) {
              playerRef.current.muted(false);
              playerRef.current.volume(1.0);
              await playerRef.current.play();
              sessionStorage.setItem('user_interacted', 'true');
            }
          };

          // Time update event
          const onTimeUpdate = () => {
            if (isDisposed.current || !playerRef.current) return;
            const currentTime = Math.floor(playerRef.current.currentTime());
            if (Math.abs(totalDurationSeconds - currentTime) <= 1) {
              onNormalAdCompleted();
              sessionStorage.removeItem('user_interacted');
              safeDispose();
            }
          };

          // Handle errors
          const onError = (e) => {
            // console.error('Video.js error:', player.error());
            onNormalAdCompleted();
            sessionStorage.removeItem('user_interacted');
            safeDispose();
          };

          // Safe dispose function
          const safeDispose = () => {
            if (playerRef.current && !isDisposed.current) {
              isDisposed.current = true;
              playerRef.current.off('timeupdate', onTimeUpdate);
              playerRef.current.off('error', onError);
              try {
                playerRef.current.dispose();
              } catch (e) {
                // console.warn('Error during player disposal:', e);
              }
              playerRef.current = null;
            }
          };

          player.on('timeupdate', onTimeUpdate);
          player.on('error', onError);

          if (!userInteracted) {
            window.addEventListener('click', unmuteOnGesture);
          } else {
            try {
              playerRef.current.muted(false);
              playerRef.current.volume(1.0);
              await playerRef.current.play(); // works because user has interacted previously
              safeDispose();
            } catch (err) {
              safeDispose();
              console.warn('Autoplay with sound blocked', err);
            }
          }
        } else {
          console.error('MediaFile or Duration not found, or ref not ready.');
          onNormalAdCompleted();
        }
      } catch (error) {
        // console.error('Error fetching or initializing ad:', error);
        onNormalAdCompleted();
      }
    };

    fetchAndInitAd();

    // Cleanup
    return () => {
      playerContainer?.removeEventListener('keydown', blockArrowKeys);
      if (playerRef.current && !isDisposed.current) {
        isDisposed.current = true;
        try {
          playerRef.current.dispose();
        } catch (e) {
          // console.warn('Error during cleanup disposal:', e);
        }
        playerRef.current = null;
      }
    };
  }, [deviceInfo, videoData, onNormalAdCompleted, randomCB, appstoreUrl, appChannelName, userInteracted]);

  const handleMuteButton = () => {
    if (playerRef.current && !isDisposed.current) {
      playerRef.current.muted(false);
      playerRef.current.volume(1.0);
      playerRef.current.play();
      sessionStorage.setItem('user_interacted', 'true');
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div data-vjs-player style={{ width: '100%', height: '100%', aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered"
          style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 2, objectFit: 'contain' }}
          tabIndex="0"
          muted
        />
      </div>
      {!userInteracted && (
        <div
          onClick={() => {
            handleMuteButton()
          }}
          className='ad_muted_button'
        >
          🔊
        </div>
      )}
    </div>
  );
};

export default AdComponent;