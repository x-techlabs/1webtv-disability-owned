/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const BgPlayer = ({ id, source }) => {
  // const playerObj = {
  //   id: null,
  //   played: false,
  // };

  const playerIns = useRef(null);

  useEffect(() => {
    if (playerIns.current !== null) return () => {};

    playerIns.current = videojs(
      id,
      {
        controls: false,
        autoplay: true,
        fluid: true,
      },
      () => {
        playerIns.current.src(source);
      }
    );

    return () => {
      playerIns.current.dispose();
    };
  }, [id, source]);

  return (
    <div className="video-container" id="video-container">
      <div id="bg-video-player">
        {id && (
          <video
            id={id}
            className="video-js vjs-default-skin"
            width="100%"
            height="100%"
          />
        )}
      </div>
    </div>
  );
};

BgPlayer.propTypes = {
  id: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

export default BgPlayer;
