import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { setUserVideoProgress } from '../../utils/localCache.util';
import { ListBulletIcon } from '@heroicons/react/16/solid';
import { ArrowLeftIcon } from '@heroicons/react/16/solid';

const BradmaxPlayer = ({ videoData, resumeFrom, type, handlePlayerClose}) => {
  const playerContainerRef = useRef(null);
  const [currentTimePlayed, setCurrentTimePlayed] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth >= 426);

  useEffect(() => {
    if (type) {
      const currentTime = currentTimePlayed;
      setUserVideoProgress(videoData.id, currentTime);
      setCurrentTimePlayed(0);
    }

    if (videoData && playerContainerRef.current) {
      const getUrl = () => {
        if (videoData.ppc_spotlight_active === "1") {
          const contentType = getCookie('video_content_type');
          if (contentType === "watch_now") {
            return videoData.ppc_watch_now_url !== "" ? videoData.ppc_watch_now_url : videoData.hlsUrl;
          }
          if (contentType === "trailer") {
            return videoData.ppc_trailer_url;
          }
        }
        return videoData.hlsUrl;
      };

      const playerConfig = {
        dataProvider: {
          source: [{ url: getUrl() }],
          subtitlesSets: [
            {
              url: videoData.srtUrl,
              languageCode: "en",
            }
          ]
        }
      };
  
      const player = window.bradmax.player.create(playerContainerRef.current, playerConfig);
      const jsapi = player.api;

      if (jsapi && typeof jsapi.play === "function") {
        jsapi.play();
        setTimeout(() => {
          if (jsapi && typeof jsapi.seek === "function") {
            jsapi.seek(resumeFrom);
          }
        }, 1000);
      }

      jsapi.add("VideoEvent.paused", onPause);
      jsapi.add("VideoEvent.currentTimeChange", onCurrentTimeChange);

      function onPause(e) {
        const currentTimeOnPause = Number(Math.floor(e.data.currentTime));
        setUserVideoProgress(videoData.id, currentTimeOnPause);
      }

      function onCurrentTimeChange(e) {
        const currentTime = Number(Math.floor(e.data.currentTime));
        setCurrentTimePlayed(currentTime);
      }

      return () => {
        if (jsapi && typeof jsapi.off === "function") {
          jsapi.off("VideoEvent.paused", onPause);
          jsapi.off("VideoEvent.currentTimeChange", onCurrentTimeChange);
        }
  
        if (player && typeof window.bradmax.player.destroy === "function") {
          window.bradmax.player.destroy(player);
        }
      };
    }
  }, [videoData, resumeFrom, type]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth >= 426);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const formattedHours = hrs > 0 ? `${hrs.toString().padStart(2, '0')}h` : '';
    const formattedMinutes = mins > 0 ? `${mins.toString().padStart(2, '0')}m` : '';
    return `${formattedHours} ${formattedMinutes}`.trim();
  }
  const formattedTime = formatDuration(videoData.duration);

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays < 1) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  }
  const formattedDate = videoData.releaseDate ? timeAgo(videoData.releaseDate) : "N/A";

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const clickOnBackButton = () => {
    const navbar = document.querySelector('.detailPage_navbar');
    const back_button = document.querySelector('.fullscreen-container-fixed .back-to-page');
    if (navbar) {
      navbar.style.display = '';
      back_button.style.top = '95px';
    }
    const currentTime = currentTimePlayed;
    setUserVideoProgress(videoData.id, currentTime);
    setTimeout(() => {
      document.querySelectorAll('.more-like-this').forEach(element => element.style.display = "block");
      document.querySelectorAll('.video-details').forEach(element => element.style.display = "block");
      handlePlayerClose();
      window.history.back();
    }, 100);
  };

  return (
    <div className='bradmax-player-container video-flex-box'>
      <div
        id="player"
        ref={playerContainerRef}
        style={{ width: '100%', height: '100%' }}
      ></div>
      
      <div className="video-info">
        <div className="info-head">
          <ListBulletIcon className="icon" />
        </div>
        <div className="heading">
          <span>Video Info</span>
        </div>
        <h4>{videoData.title}</h4>
        {formattedDate !== 'N/A' && (<span><b>Published:</b> {formattedDate}</span>)}
        {formattedTime !== '' && (<span><b>Duration:</b> {formattedTime}</span>)}
        <p>{videoData.description}</p>
      </div>
      <div
        className="close-video-container prj-element"
        id="back-to-page-video"
      >
        <ArrowLeftIcon className="size-2" 
        onClick={() => clickOnBackButton()} />
        {isMobileView ? videoData.title : (videoData.title.length > 20 ? `${videoData.title.slice(0, 20)}...` : videoData.title)}
      </div>
    </div>
  );
};

BradmaxPlayer.propTypes = {
  videoData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    hlsUrl: PropTypes.string.isRequired,
  }).isRequired,
  resumeFrom: PropTypes.number,
  type: PropTypes.bool,
};

export default BradmaxPlayer;
