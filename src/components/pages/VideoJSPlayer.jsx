/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
// import PropTypes from "prop-types";
import videojs from "video.js";
// import OneStudioSSAIAdsPlugin from "../../onestudio-ssai-ads/src/onestudio-ads";
import play from "../../assets/images/icons/play-img-new.png";
import pause from "../../assets/images/icons/pause.png";
import fastforward from "../../assets/images/icons/fast-forward.png";
import rewind from "../../assets/images/icons/rewind.png";
import { setUserVideoProgress } from "../../utils/localCache.util";
import { getAllDeviceInfo } from "../../utils/deviceInfo.util";
import { buildLiveVastUrl } from "../../utils/liveVastUrl";
// import { getVastUrl } from "../../services/channelData.service";
// import closeIcon from "../../assets/images/icons/close.png";
import "video.js/dist/video-js.css";
// import { PLATFORMS } from "../../config/const.config";
import { ArrowLeftIcon, ListBulletIcon } from "@heroicons/react/16/solid";

import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";

const VideoJSPlayer = ({ id, videoData, resumeFrom, handlePlayerClose }) => {
    const videoPlayerContainer = useRef();
    const playerIns = useRef();

    const playerObj = {
        played: false,
        videoUrl: "",
        vastUrl: "",
    };

    const appName = process.env.REACT_APP_FIRETV_APP_NAME;
    const videoId = videoData.id;
    const { title, season, episode, rating, channelId, duration } = videoData;
    const genres = videoData.content_type ? videoData.content_type : videoData.type === "event" ? "LIVE" : "VOD";
    const [isPlaying, setIsPlaying] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const randomCB = Math.floor(Math.random() * 100000);

    const timeFormat = (seconds) => {
        let secs = seconds;
        if (!secs || secs <= 0) return "00:00:00";

        const hours = Math.floor(secs / 3600);
        secs -= hours * 3600;
        const mins = Math.floor(secs / 60);
        secs = Math.floor(secs % 60);

        return `${hours.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const updateProgressBar = (current, total) =>
        (Math.floor(current) / Math.floor(total)) * 100;

    const initializeMediaMelon = () => {
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

                const isLive = videoData.type === "event" ? true : false; 
                const mmVideoAssetInfo = {
                    assetName: title,
                    assetId: videoId.toString(),
                    videoId: videoId.toString(),
                    contentType: genres ? genres : "LIVE",
                    genre: genres,
                    drmProtection: "Unknown",
                    episodeNumber: episode?.toString(),
                    season: season?.toString(),
                    seriesTitle: "",
                    videoType: isLive ? "LIVE" : "VOD",
                    customTags: {
                        custom_1: channelId?.toString() || "",
                    },
                };

                mmvjsPlugin.initialize(
                    playerIns.current,
                    playerObj.videoUrl,
                    mmVideoAssetInfo,
                    isLive
                );
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

    useEffect(() => {
        // fetch device info first
        const loadDeviceInfo = async () => {
          const info = await getAllDeviceInfo();
          setDeviceInfo(info);
        };
        loadDeviceInfo();
    }, []);

    const setupPlayer = () => {
        if (!deviceInfo) return;

        let videoHLSUrl;
        if (videoData.type === "event" && videoData.hlsUrl) {
            try {
                const live_event_url = buildLiveVastUrl({
                    hlsVideo: videoData.hlsUrl,
                    videoData,
                    deviceInfo,
                    randomCB,
                });
                videoHLSUrl = live_event_url;
            } catch (err) {
                videoHLSUrl = playerObj.videoUrl; // fallback
            }
        } else {
            videoHLSUrl = playerObj.videoUrl;
        }
        
        try {
            playerIns.current = videojs(videoPlayerContainer.current, {
                controls: true,
                autoplay: true,
                fluid: true,
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
                poster: videoData.poster,
                sources: [
                    {
                        type: "application/x-mpegurl",
                        src: videoHLSUrl,
                    },
                ],
                tracks: [
                    {
                        src: videoData.vttUrl,
                        kind: "captions",
                        srclang: "en",
                        label: "English",
                        default: true,
                        mode: "showing",
                    },
                ],
            });

            playerIns.current.ready(() => {
                // Initialize MediaMelon when player is ready
                waitForMediaMelonPlugin(initializeMediaMelon);

                // Total Duration
                const totalTimeDuration = window.document.getElementById("total-time");
                playerIns.current.on("loadedmetadata", () => {
                    const durations = timeFormat(Math.floor(playerIns.current.duration()));
                    if (totalTimeDuration) {
                        totalTimeDuration.innerText = durations;
                    }
                });

                // Progress and time update
                const currentTimeDuration =
                    window.document.getElementById("current-time");
                playerIns.current.on("timeupdate", () => {
                    const currentDuration = timeFormat(
                        Math.floor(playerIns.current.currentTime())
                    );
                    currentTimeDuration.innerText = currentDuration;

                    const playerProgressBarWidth = window.document.getElementById("player-progress");
                    if (playerProgressBarWidth) {
                        playerProgressBarWidth.style.width = `${updateProgressBar(
                            playerIns.current.currentTime(),
                            playerIns.current.duration()
                        )}%`;
                    }
                    const watchTime = Math.floor(playerIns.current.currentTime());
                    if (watchTime === 0) return;

                    if (watchTime % 5 === 0) {
                        setUserVideoProgress(videoData.id, watchTime);
                    }
                });

                playerIns.current.on("play", () => {
                    if (resumeFrom > 0 && !playerObj.played) {
                        playerObj.played = true;
                        playerIns.current.currentTime(resumeFrom);
                    }
                    setIsPlaying(true);
                });

                // Enable quality selector
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                if (!isIOS) {
                    if (playerIns.current.hlsQualitySelector) {
                       playerIns.current.hlsQualitySelector({ displayCurrentQuality: true });
                    }
                }

                // 👇 Force quality switching when user selects
                const qualityLevels = playerIns.current.qualityLevels();
                qualityLevels.on('addqualitylevel', (event) => {
                    const level = event.qualityLevel;
                    level.enabled = true; // enable ABR by default
                });

                playerIns.current.on('qualitySelected', (event, data) => {
                    const quality = data.newQuality; // e.g., "720p"
                    const levels = playerIns.current.qualityLevels();

                    for (let i = 0; i < levels.length; i++) {
                        levels[i].enabled = levels[i].height === parseInt(quality, 10);
                    }
                });

                playerIns.current.on("pause", () => {
                    const watchTime = Math.floor(playerIns.current.currentTime());
                    if (watchTime === 0) return;
                    setUserVideoProgress(videoData.id, Number(watchTime));
                    setIsPlaying(false);
                });
                playerIns.current.on("ended", () => {
                    setIsPlaying(false);
                });
                playerIns.current.on("adstart", () => {
                    window.document.getElementById("player-bottom-bar").style.display =
                        "none";
                });

                playerIns.current.on("ads-ad-ended", () => {
                    window.document.addEventListener(
                        "keydown",
                        () => {
                            if (window.document.getElementById("player-bottom-bar")) {
                                window.document.getElementById("player-bottom-bar").style.display =
                                    "block";
                                setTimeout(() => {
                                    if (window.document.getElementById("player-bottom-bar")) {
                                        window.document.getElementById(
                                            "player-bottom-bar"
                                        ).style.display = "none";
                                    }
                                }, 7000);
                            }
                        },
                        false
                    );
                });
            });
        } catch (e) {
            // console.error("Player setup failed", e);
        }
    };

    const clickOnBackButton = () => {
        const navbar = document.querySelector(".detailPage_navbar");
        const back_button = document.querySelector(
            ".fullscreen-container-fixed .back-to-page"
        );
        if (navbar) {
            navbar.style.display = "";
            back_button.style.top = "95px";
        }
        setTimeout(() => {
            document
                .querySelectorAll(".more-like-this")
                .forEach((element) => (element.style.display = "block"));
            document
                .querySelectorAll(".video-details")
                .forEach((element) => (element.style.display = "block"));
            handlePlayerClose();
            window.history.back();
        }, 100);
    };

    useEffect(() => {
        playerObj.videoUrl = videoData.hlsUrl;
        setupPlayer();

        setTimeout(() => {
            if (window.document.getElementById("player-bottom-bar")) {
                window.document.getElementById("player-bottom-bar").style.display =
                    "none";
            }
        }, 10000);

        return () => {
            if (playerIns.current) {
                playerIns.current.dispose();
                playerIns.current = null;
            }
        };
    }, [deviceInfo]);

    const formattedDate = videoData.releaseDate ? timeAgo(videoData.releaseDate) : "N/A";
    function timeAgo(dateString) {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        if (diffInDays < 1) return "Today";
        if (diffInDays === 1) return "1 day ago";
        if (diffInDays < 30) return `${diffInDays} days ago`;
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
        }
        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
    }

    const formattedTime = formatDuration(videoData.duration);
    function formatDuration(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const formattedHours = hrs > 0 ? `${hrs.toString().padStart(2, "0")}h` : "";
        const formattedMinutes = mins > 0 ? `${mins.toString().padStart(2, "0")}m` : "";
        return `${formattedHours} ${formattedMinutes}`.trim();
    }

    return (
        <>
        <div
            className="close-video-container prj-element"
            id="back-to-page-video" onClick={() => clickOnBackButton()}
        >
            <ArrowLeftIcon className="size-2" />
            <span>{videoData.title}</span>
        </div>
        <div className="videojs-player-container video-flex-box">
            <div id="video-player">
                <video
                    id={id}
                    className="video-js vjs-default-skin vjs-big-play-centered"
                    width="auto"
                    height="auto"
                    controls={true}
                    ref={videoPlayerContainer}
                    crossOrigin="anonymous"
                    playsInline
                />
            </div>
            <div className="player-overlay">
                <div className="player-bottom-bar" id="player-bottom-bar">
                    <div className="player-text">
                        <div className="player-watching-text">You&#39;re Watching</div>
                        <div className="player-title">{title}</div>
                    </div>
                    <div className="player-progress-track">
                        <div id="player-progress" className="player-progress-bar" />
                    </div>
                    <div className="player-timer">
                        <div id="current-time" className="player-time">
                            00:00:00
                        </div>
                        /
                        <div id="total-time" className="player-time">
                            00:00:00
                        </div>
                        <div className="player-button-group">
                            <div
                                className="rewind media-btn prj-element"
                                id="rewind"
                                data-focus-left="#rewind"
                                data-focus-right="#play-pause"
                                data-focus-up="#rewind"
                                data-focus-down="#rewind"
                                onClick={() => {
                                    videojs(`player`).currentTime(
                                        videojs(`player`).currentTime() - 10
                                    );
                                }}
                            >
                                <img src={rewind} alt="" className="media-btn-img" />
                            </div>
                            <div
                                className="playpause media-btn prj-element"
                                id="play-pause"
                                data-focus-left="#rewind"
                                data-focus-right="#fast-forward"
                                data-focus-up="#play-pause"
                                data-focus-down="#play-pause"
                            >
                                <img
                                    src={isPlaying ? pause : play}
                                    alt=""
                                    className="media-btn-img"
                                    onClick={() => {
                                        if (videojs(`player`).paused()) {
                                            setIsPlaying(true);
                                            videojs(`player`).play();
                                        } else {
                                            setIsPlaying(false);
                                            videojs(`player`).pause();
                                        }
                                    }}
                                />
                            </div>
                            <div
                                className="fastforward media-btn prj-element"
                                id="fast-forward"
                                data-focus-left="#play-pause"
                                data-focus-right="#fast-forward"
                                data-focus-up="#fast-forward"
                                data-focus-down="#fast-forward"
                                onClick={() => {
                                    videojs(`player`).currentTime(
                                        videojs(`player`).currentTime() + 10
                                    );
                                }}
                            >
                                <img src={fastforward} alt="" className="media-btn-img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        </div>
        </>
    );
};

export default VideoJSPlayer;
