import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { getMenuVideoDetails, getMenuDetails } from '../../services/channelData.service';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Link } from 'react-router-dom';
import { VIDEO_TYPES } from '../../config/const.config';
import landscape_dummy_poster from "../../assets/images/landscape_dummy_poster.png";
import portrait_dummy_poster from "../../assets/images/portrait_dummy_poster.png";

const LiveStreamComponent = ({
  id,
  title,
  activePage,
  activeSubPage,
  activeSubPageParent,
  type,
  menuData,
  subMenuData,
}) => { 
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlaylistAlongLiveEvents, setActivePlaylistAlongLiveEvents] = useState(null);
  const [activePlaylistAlongLiveEventsName, setActivePlaylistAlongLiveEventsName] = useState(null);
  const [liveStreamUrl, setLiveStreamUrl] = useState('');
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const perPage = 20;
  const isPortrait = type === VIDEO_TYPES.MOVIES;
  const [pageTitle, setPageTitle] = useState();
  const [pageSubTitle, setPageSubTitle] = useState();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isWebTvTargetShown, setIsWebTvTargetShown] = useState(false);
  const lastScrollTop = useRef(0);

  //  Get live playlist ID
  useEffect(() => {
    if (!activePage) return;

    getMenuDetails(activePage)
      .then((res) => {
        let livePlaylistId = null;
        let livePlaylistName = '';

        res.content.playlists.forEach((playlist) => {
          if (!livePlaylistId && playlist.playlist_along_live_events === 1) {
            livePlaylistId = playlist._id;
            livePlaylistName = playlist.title;
          }

          if (playlist.child_playlists && !livePlaylistId) {
            playlist.child_playlists.forEach((child) => {
              if (!livePlaylistId && child.playlist_along_live_events === 1) {
                livePlaylistId = child._id;
                livePlaylistName = child.title;
              }
            });
          }
        });

        if (livePlaylistId) {
          setActivePlaylistAlongLiveEvents(livePlaylistId);
          setActivePlaylistAlongLiveEventsName(livePlaylistName);
        } else {
          console.warn('No live playlist found.');
        }
      })
      .catch((err) => {
        console.error('Error fetching menu details:', err);
      });
  }, [activePage]);

  useEffect(() => {
    const page_url = activePage ? Number(activePage) : Number(localStorage.getItem('pageClick'));
    const matchedMenuItem = menuData.find(item => item.id === page_url);
    const matchedTitle = matchedMenuItem ? matchedMenuItem.title : 'Unknown';
    setPageTitle(encodeURIComponent(matchedTitle));
  }, [activePage, menuData]);

  useEffect(() => {
    if (subMenuData && Array.isArray(subMenuData)) {
      let subTitle;
      if (activeSubPageParent != null) {
        subTitle = subMenuData.find((item) => item.id === Number(activeSubPageParent));
      } else {
        subTitle = subMenuData.find((item) => item.id === activePlaylistAlongLiveEvents);
      }
      if (subTitle) {
        setPageSubTitle(encodeURIComponent(subTitle.title));
      }
    } else {
      setPageSubTitle(subMenuData);
    }
  }, [subMenuData, activePlaylistAlongLiveEvents]);

  // Fetch highlight videos
  useEffect(() => {
    if (!activePage || !activePlaylistAlongLiveEvents) return;

    getMenuVideoDetails(activePage, activePlaylistAlongLiveEvents, 1, perPage)
      .then((res) => {
        const videoList = res?.content?.videos || [];
        setVideos(videoList);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        console.error('Error fetching video details');
      });
  }, [activePage, activePlaylistAlongLiveEvents]);

  // Fetch livestream video
  useEffect(() => {
    if (!activePage || !activeSubPage) return;
  
    getMenuVideoDetails(activePage, activeSubPage, 1, perPage)
      .then((res) => {
        const videoList = res?.content?.videos || [];
        const hlsVideo = videoList.find((v) => v.hls_url);
        if (hlsVideo?.hls_url) {
          const cleanUrl = hlsVideo.hls_url.split('?')[0]; // 👈 Remove all the extra query params
          setLiveStreamUrl(cleanUrl);
        } else {
          console.warn('No hls_url found in livestream data');
        }
      })
      .catch((err) => {
        console.error('Error fetching livestream video:', err);
      });
  }, [activePage, activeSubPage]);

 
  useEffect(() => {
    if (liveStreamUrl && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src:liveStreamUrl,
          type: 'application/x-mpegURL',
        }],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [liveStreamUrl]);

  useEffect(() => {
    if (videos.some(v => v?.targetUrl || v?.poster)) {
      setIsWebTvTargetShown(true);
    } else {
      setIsWebTvTargetShown(false);
    }
  }, [videos]);

  useEffect(() => {
    const rootEl = document.getElementById("root");
    const handleScroll = () => {
      const st = rootEl.scrollTop;
      if (st > lastScrollTop.current) {
        setIsScrollingDown(true);
      }
      if (st === 0) {
        setIsScrollingDown(false);
      }
      lastScrollTop.current = st <= 0 ? 0 : st;
    };
    rootEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => rootEl.removeEventListener("scroll", handleScroll);
  }, []);

    const fallbackImage = (error, titleName, isPortrait) => {
      if (error?.target) {
          error.target.src = isPortrait ? portrait_dummy_poster : landscape_dummy_poster;
          error.target.alt = titleName;
          error.target.className = isPortrait ? 'error-image-default-image portrait' : 'error-image-default-image landscape';
      }
      return error;
    };

  const handlePlayerOpen = (fromProgress) => {
    const navbar = document.querySelector('.detailPage_navbar');
    const back_button = document.querySelector('.fullscreen-container-fixed .back-to-page');
    if (navbar) {
      navbar.style.display = 'none';
      back_button.style.top = '35px';
    }
  };

  return (
    <div className={`horizontal-list live-stream-component ${isScrollingDown ? "scroll-down-active" : ""}`}  id={`hl-${id}`}>
      <div className="live-stream-left">
        <h3>{title}</h3>
        <div className="" id="video-player1">
          {liveStreamUrl ? (
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              playsInline
              controls
              autoPlay
              muted
            />
          ) : (
            <p>Live stream not available.</p>
          )}
        </div>
      </div>

      <div className={`live-stream-right ${activePlaylistAlongLiveEvents === null ? 'hidden' : ''} ${isWebTvTargetShown === true ? "webtv_target_shown" : ''}`}>
        {loading ? (
          <p>Loading highlights...</p>
        ) : videos.length === 0 ? (
          <p>No highlights available.</p>
        ) : (
          <>
              <h3 className='grid_title_see_more'>
                <div className="grid-title" id={type}>
                  {activePlaylistAlongLiveEventsName}
                </div>
                {isWebTvTargetShown === false ? (
                  <Link to={`/channels/details/${encodeURIComponent(activePlaylistAlongLiveEventsName)}`} className='see_more_options' id={activePlaylistAlongLiveEventsName} state={{ activeSubPageParent }}>
                    See More
                  </Link>
                ) : ''}
              </h3>
              <div className='segment-outer'>
                {videos.map((video) => (
                  video.type !== "external_link" ? (
                  <Link
                    key={video._id}
                    to={`/${pageTitle}/${pageSubTitle}/${encodeURIComponent(video.title)}`}
                    className={`media-element ${
                      isPortrait ? 'portrait' : 'landscape'
                    } prj-element`}>
                    <div key={video._id} className="segment-item">
                      <div className="img live-stream-right-image">
                        <div className="overlay-box">
                          <div className="btns-group">
                            <Link
                              to={`/watch/featured/${encodeURIComponent(video.title)}`}
                              className="btn" type='button'
                              data-focus-left="#resume-btn"
                              data-focus-right={false}
                              data-focus-up={false}
                              data-focus-down=".video.prj-element"
                              data-on-self-focus="#video-detail-focus"
                              onClick={() => {
                                handlePlayerOpen(false);
                              }}>
                              {type !== VIDEO_TYPES.MOVIES ? (
                                <div className="icon-parent">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                "Play"
                              )}
                            </Link>
                          </div>
                        </div>
                        <div className="img-container">
                          <img
                            id={`target-image-h-v-${video._id}`}
                            src={video.poster_16_9 || video.poster}
                            alt={title}
                            loading="lazy"
                            onError={(error) => fallbackImage(error, title)}
                          />
                        </div>
                      </div>
                      <div className="segment-text">
                        <h4>{video.title}</h4>
                        <p>
                          {video.short_description ||
                            video.description ||
                            'No description available.'}
                        </p>
                      </div>
                    </div>
                  </Link>
                  ) : (
                    <Link
                      key={video._id}
                      to={`${video.targetUrl}`}
                      target='_blank'
                      className={`media-element ${
                      isPortrait ? 'portrait' : 'landscape'
                    } prj-element`}
                    onClick={() => setIsWebTvTargetShown(true)}>
                      <div className='webtv_target_images'>
                        <div className="img-container">
                        <img
                          id={`target-image-h-v-${video._id}`}
                          src={video.poster}
                          alt={title}
                          loading="lazy"
                          onError={(error) => fallbackImage(error, title)}
                        />
                      </div>
                      </div>
                    </Link>
                  )
                ))
            }
          </div>
          </>
        )}
      </div>
    </div>
  );
};

LiveStreamComponent.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  activePage: PropTypes.number,
  activeSubPage: PropTypes.string,
};

export default LiveStreamComponent;
