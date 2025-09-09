import React, { useEffect, useRef } from 'react';
import { getVastAd } from '../../services/channelData.service';

const AdComponent = ({ onNormalAdCompleted }) => {
  const bradmaxRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const blockArrowKeys = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const playerContainer = bradmaxRef.current;
    playerContainer?.addEventListener('keydown', blockArrowKeys);

    const fetchAndInitAd = async () => {
      try {
        const vast_url_api = await getVastAd();
        const vastURL = vast_url_api.content.vast_url;
        if (vastURL === null) {
          onNormalAdCompleted();
          return;
        }
        const response = await fetch(vastURL);
        if (!response.ok) {
          console.error('Failed to fetch VAST config:', response.statusText);
          return;
        }
        const vastXML = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(vastXML, 'application/xml');

        const mediaFile = xmlDoc.querySelector('Creative > Linear > MediaFiles > MediaFile');
        const duration = xmlDoc.querySelector('Creative > Linear > Duration')?.textContent;

        if (mediaFile && duration && bradmaxRef.current) {
          let adMediaUrl = mediaFile.textContent.trim();
          let adDuration = duration.trim();

          const [hours, minutes, seconds] = adDuration.split(':').map(parseFloat);
          const totalDurationSeconds = (hours * 3600) + (minutes * 60) + seconds;

          const playerConfig = {
            dataProvider: {
              source: [{ url: adMediaUrl }],
            },
          };

          try {
            const player = window.bradmax.player.create(bradmaxRef.current, playerConfig);
            const jsapi = player.api;
            jsapi.play();
            jsapi.add('VideoEvent.currentTimeChange', onCurrentTimeChange);

            function onCurrentTimeChange(e) {
              const currentTime = Number(Math.floor(e.data.currentTime));
              if (currentTime === totalDurationSeconds) {
                onNormalAdCompleted();
              }
            }

            return () => {
              playerContainer?.removeEventListener('keydown', blockArrowKeys);

              if (player && typeof window.bradmax.player.destroy === 'function') {
                window.bradmax.player.destroy(player);
              }

              if (jsapi && typeof jsapi.off === "function") {
                jsapi.off("VideoEvent.currentTimeChange", onCurrentTimeChange);
              }
            };
          } catch (playerError) {
            console.error('Error during Bradmax player initialization:', playerError);
            onNormalAdCompleted();
          }
        } else {
          console.error('MediaFile or Duration not found, or ref not ready.');
          onNormalAdCompleted();
        }
      } catch (error) {
        console.error('Error fetching or initializing ad:', error);
        onNormalAdCompleted();
      }
    };

    fetchAndInitAd();
    return () => {
      playerContainer?.removeEventListener('keydown', blockArrowKeys);
    };
  }, [onNormalAdCompleted]);

  return (
    <div>
      <div id="player" className='player' ref={bradmaxRef} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 2 }} tabIndex="0"></div>
    </div>
  );
};

export default AdComponent;
