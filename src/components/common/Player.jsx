/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// import videojs from 'video.js';
// import OneStudioSSAIAdsPlugin from '../../onestudio-ssai-ads/src/onestudio-ads';
// import play from '../../assets/images/icons/play-img-new.png';
// import pause from '../../assets/images/icons/pause.png';
// import fastforward from '../../assets/images/icons/fast-forward.png';
// import rewind from '../../assets/images/icons/rewind.png';
// import { setUserVideoProgress } from '../../utils/localCache.util';
// import { getAllDeviceInfo } from '../../utils/deviceInfo.util';
// import { getVastUrl } from '../../services/channelData.service';
// import closeIcon from '../../assets/images/icons/close.png';
import 'video.js/dist/video-js.css';
// import { PLATFORMS } from '../../config/const.config';
// import BradmaxPlayer from '../../components/pages/BradmaxPlayer';
import AdComponent from '../pages/AdComponent';
import VideoJSPlayer from '../pages/VideoJSPlayer';

const Player = ({ id, videoData, resumeFrom, handlePlayerClose }) => {
  const [normalAdCompleted, setNormalAdCompleted] = useState(false);
  
  return (
    <>
      <div className="video-container" id="video-container">
        {!normalAdCompleted ? (
          <AdComponent onNormalAdCompleted={() => setNormalAdCompleted(true)} />
        ) : (
          <VideoJSPlayer videoData={videoData} resumeFrom={resumeFrom} handlePlayerClose={handlePlayerClose} />
        )}
      </div>
    </>
  );
};

Player.propTypes = {
  id: PropTypes.string.isRequired,
  videoData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    poster: PropTypes.string,
    posterH: PropTypes.string,
    posterV: PropTypes.string,
    hlsUrl: PropTypes.string,
    isPortrait: PropTypes.bool,
    genres: PropTypes.string,
    duration: PropTypes.number,
    category: PropTypes.string,
    channelId: PropTypes.number,
    director: PropTypes.string,
    actor1: PropTypes.string,
    actor2: PropTypes.string,
    actor3: PropTypes.string,
    rating: PropTypes.string,
    ratingSource: PropTypes.string,
    season: PropTypes.number,
    episode: PropTypes.number,
    srtUrl: PropTypes.string,
    vttUrl: PropTypes.string,
    source: PropTypes.string,
    playDirectUrl: PropTypes.string,
    liveVastUrl: PropTypes.string,
  }).isRequired,
  resumeFrom: PropTypes.number.isRequired,
  handlePlayerClose: PropTypes.func.isRequired,
};

export default Player;
