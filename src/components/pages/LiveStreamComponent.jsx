/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { getMenuVideoDetails, getMenuDetails } from '../../services/channelData.service';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Link } from 'react-router-dom';
import { VIDEO_TYPES } from '../../config/const.config';
import landscape_dummy_poster from "../../assets/images/landscape_dummy_poster.webp";
import portrait_dummy_poster from "../../assets/images/portrait_dummy_poster.webp";
import { buildLiveVastUrl } from '../../utils/liveVastUrl';
import { getAllDeviceInfo } from '../../utils/deviceInfo.util';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";

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
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [liveVideoDetails, setLiveVideoDetails] = useState(null);
  const randomCB = Math.floor(Math.random() * 100000);
  const appName = process.env.REACT_APP_FIRETV_APP_NAME;
  const mediaMelonInitialized = useRef(false);

  const initializeMediaMelon = () => {
    if (mediaMelonInitialized.current) return;
    const videoId = liveVideoDetails._id;
    try {
      let mmvjsPlugin = null;
      if (window.VideoJSMMSSIntgr) {
        mmvjsPlugin = new window.VideoJSMMSSIntgr();
      } else {
        // console.warn("MediaMelon plugin not found on window");
        return;
      }
      if (!mmvjsPlugin || mmvjsPlugin.getRegistrationStatus()) return;

      mmvjsPlugin.registerMMSmartStreaming(
        "HBCUGOPlayer",
        process.env.REACT_APP_MEDIAMELON_CUSTOMER_ID,
        null,
        window.location.hostname,
        null,
        null
      );

      mmvjsPlugin.reportPlayerInfo("HBCU GO", "ReactPlayer", "1.0.0");
      mmvjsPlugin.reportAppInfo(appName || "HBCU GO", "1.0.0");
      mmvjsPlugin.setDeviceInfo(navigator.userAgent);
      mmvjsPlugin.reportVideoQuality("HD");

      const isLive = liveVideoDetails.isLive === 1 ? "Live" : "VOD";
      const mmVideoAssetInfo = {
        assetName: title,
        assetId: videoId.toString(),
        videoId: videoId.toString(),
        contentType: "Live",
        genre: "Live",
        drmProtection: "Unknown",
        seriesTitle: "",
        videoType: isLive ? "LIVE" : "VOD",
      };

      mmvjsPlugin.initialize(
        playerRef.current,
        liveStreamUrl,
        mmVideoAssetInfo,
        isLive
      );
      mediaMelonInitialized.current = true;
      // console.log("MediaMelon initialized successfully");
    } catch (error) {
      // console.error("MediaMelon SmartSight initialization failed", error);
    }
  };

  const waitForMediaMelonPlugin = (callback, maxRetries = 5, interval = 500) => {
    let retries = 0;
    const checkPlugin = () => {
      if (window.VideoJSMMSSIntgr) {
        callback();
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(checkPlugin, interval);
      } else {
        // console.error("MediaMelon plugin failed to load after retries");
      }
    };
    checkPlugin();
  };

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
          // console.warn('No live playlist found.');
        }
      })
      .catch((err) => {
        // console.error('Error fetching menu details:', err);
      });
  }, [activePage]);

  useEffect(() => {
    const page_url = activePage ? Number(activePage) : Number(localStorage.getItem('pageClick'));
    const matchedMenuItem = menuData.find(item => item.id === page_url);
    const matchedTitle = matchedMenuItem ? matchedMenuItem.title : 'Unknown';
    setPageTitle(encodeURIComponent(matchedTitle));
  }, [activePage, menuData]);

  useEffect(() => {
    // fetch device info first
    const loadDeviceInfo = async () => {
      const info = await getAllDeviceInfo();
      setDeviceInfo(info);
    };
    loadDeviceInfo();
  }, []);

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
        // console.error('Error fetching video details');
      });
  }, [activePage, activePlaylistAlongLiveEvents]);

  // Fetch livestream video
  useEffect(() => {
    if (!deviceInfo || !activePage || !activeSubPage) return;
  
    getMenuVideoDetails(activePage, activeSubPage, 1, perPage)
      .then((res) => {
        const videoList = res?.content?.videos || [];
        const hlsVideo = videoList.find((v) => v.hls_url);
        if (hlsVideo?.hls_url) {
          const singleVideo = videoList[0];
          setLiveVideoDetails(singleVideo);
          const liveVastUrl = buildLiveVastUrl({hlsVideo: hlsVideo?.hls_url, videoData: singleVideo, deviceInfo, randomCB});
          setLiveStreamUrl(liveVastUrl);
        } else {
          // console.warn('No hls_url found in livestream data');
        }
      })
      .catch((err) => {
        // console.error('Error fetching livestream video:', err);
      });
  }, [activePage, activeSubPage, deviceInfo, perPage]);
 
  useEffect(() => {
    if (liveStreamUrl && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        responsive: true,
        controlBar: {
          pictureInPictureToggle: false,
        },
        html5: {
          vhs: {
            experimentalBufferBasedABR: true,
            overrideNative: true, // needed for captions control
          },
          nativeTextTracks: false
        },
        fluid: true,
        sources: [{
          src: liveStreamUrl,
          type: 'application/x-mpegURL',
        }],
      });

      playerRef.current.ready(() => {
        // Initialize MediaMelon when player is ready
        waitForMediaMelonPlugin(initializeMediaMelon);
      });

      // Enable quality selector
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (!isIOS) {
        playerRef.current.hlsQualitySelector({
          displayCurrentQuality: true,
        });
      }

      // 👇 Force quality switching when user selects
      const qualityLevels = playerRef.current.qualityLevels();
      qualityLevels.on('addqualitylevel', (event) => {
        const level = event.qualityLevel;
        level.enabled = true; // enable ABR by default
      });

      playerRef.current.on('qualitySelected', (event, data) => {
        const quality = data.newQuality; // e.g., "720p"
        const levels = playerRef.current.qualityLevels();

        for (let i = 0; i < levels.length; i++) {
          levels[i].enabled = levels[i].height === parseInt(quality, 10);
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
        mediaMelonInitialized.current = false;
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
    const bodyEl = document.body;
    const handleScroll = () => {
      const st = bodyEl.scrollTop;
      if (st > lastScrollTop.current) {
        setIsScrollingDown(true);
      }
      if (st === 0) {
        setIsScrollingDown(false);
      }
      lastScrollTop.current = st <= 0 ? 0 : st;
    };
    bodyEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => bodyEl.removeEventListener("scroll", handleScroll);
  }, []);

  const fallbackImage = (error, titleName) => {
    const errorElement = window.document.getElementById(error.target.id);
    if (error?.target) {
      errorElement.outerHTML = `<img src="${isPortrait ? portrait_dummy_poster : landscape_dummy_poster}" alt="${titleName}" class="${isPortrait ? 'error-image-default-image portrait' : 'error-image-default-image landscape'}" />`;
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
              crossOrigin="anonymous"
              loading="lazy"
            />
          ) : (
            <Skeleton height="calc(100vh - 320px)" width="100%" baseColor="#e0e0e000" highlightColor="#f5f5f559"/>
          )}
        </div>
      </div>

      <div className={`live-stream-right ${activePlaylistAlongLiveEvents === null ? 'hidden' : ''} ${isWebTvTargetShown === true ? "webtv_target_shown" : ''}`}>
        {loading ? (
          <Skeleton height="calc(100vh - 320px)" width="100%" baseColor="#e0e0e000" highlightColor="#f5f5f559" style={{ marginTop: '45px' }}/>
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
                    <div key={video._id} className="segment-item special_posters_div">
                      <div className="img live-stream-right-image">
                        <div className="overlay-box">
                          <div className="btns-group">
                            <Link
                              to={`/watch/featured/${encodeURIComponent(video.title)}`}
                              aria-label={`${video.title}`}  
                              className="btn"
                              data-focus-left="#resume-btn"
                              data-focus-right={false}
                              data-focus-up={false}
                              data-focus-down=".video.prj-element"
                              data-on-self-focus="#video-detail-focus"
                              onClick={() => {
                                handlePlayerOpen(false);
                                sessionStorage.setItem("user_interacted", true)
                              }}>
                              {type !== VIDEO_TYPES.MOVIES ? (
                                <div className="icon-parent">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6"
                                    aria-label={`Play ${video.title} icon`}
                                  >
                                    <title>Play video</title>
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
                            src={video?.special_featured_poster ? video.special_featured_poster : video.poster_16_9}
                            alt={title}
                            onError={(error) => fallbackImage(error, title, isPortrait)}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                  ) : (
                    <Link
                      key={video._id}
                      to={`${video.targetUrl}`}
                      {...(video.target_new_page === 1 ? { target: "_blank" } : {})}
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
  activePage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeSubPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LiveStreamComponent;
