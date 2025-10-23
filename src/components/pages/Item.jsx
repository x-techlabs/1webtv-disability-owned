/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { VIDEO_TYPES } from '../../config/const.config';
// import convertSecToTime from '../../utils/timeformat.util';
import { addLocalStorageData } from '../../utils/localCache.util';
import landscape_dummy_poster from "../../assets/images/landscape_dummy_poster.webp";
import portrait_dummy_poster from "../../assets/images/portrait_dummy_poster.webp";

const Item = ({
  id,
  playlist_id,
  videoId,
  title,
  description,
  shortDescription,
  long_description,
  hlsUrl,
  poster,
  posterH,
  posterV,
  startTime,
  endTime,
  duration,
  progress,
  genres,
  category,
  channelId,
  director,
  actor1,
  actor2,
  actor3,
  rating,
  releaseDate,
  ratingSource,
  season,
  episode,
  srtUrl,
  vttUrl,
  source,
  playDirectUrl,
  liveVastUrl,
  type,
  monetization_type,
  monetization_price,
  monetization_duration,
  monetization_custom_duration,
  monetization_start_time,
  monetization_end_time,
  dataFocusLeft,
  dataFocusRight,
  dataFocusUp,
  dataFocusDown,
  dataOnSelfFocus,
  handleShowDetailPage,
  dataOnPagination,
  activePage,
  activeSubPage,
  activeSubPageParent,
  seriesCount,
  release_date,
  episode_count,
  isSeries,
  menuData,
  subMenuData,
  gridView
}) => {
  const location = useLocation();
  const page_url = activePage ? activePage : localStorage.getItem('pageClick');
  const [pageTitle, setPageTitle] = useState();
  const [pageSubTitle, setPageSubTitle] = useState();
  const [seriesSubTitle, setSeriesSubTitle] = useState();
  const [currentUrl, setCurrentUrl] = useState();
  const [showPlayer, setShowPlayer] = useState(false);
  const showProgress = Math.floor((progress * 100) / duration);
  const isPortrait = type === VIDEO_TYPES.MOVIES;
  const getactiveSubPage = localStorage.getItem('pageSubClick');
  const pageSubClick = getactiveSubPage ? getactiveSubPage : activeSubPage;
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const placeholderImage = isPortrait ? portrait_dummy_poster : landscape_dummy_poster;
  const optimizedPoster = `${isPortrait ? posterV : posterH}?width=800&format=webp`;

  const fallbackImage = (error, titleName) => {
    const imgElement = error.currentTarget;
    if (!imgElement) return;

    if (imgElement) {
      imgElement.outerHTML = `<img src="${isPortrait ? portrait_dummy_poster : landscape_dummy_poster}" alt="${titleName}" class="${isPortrait ? 'error-image-default-image portrait' : 'error-image-default-image landscape'}" />`;
      setImageFailed(true);
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
    setShowPlayer(true);
  };

  useEffect(() => {
    const pathname = location.pathname;
    const segments = pathname.split('/');
    segments.pop();
    const basePath = segments.join('/');

    if (basePath !== currentUrl) {
      setCurrentUrl(basePath);
    }
  }, [location, currentUrl]);

  useEffect(() => {
    const page_url = activePage ? Number(activePage) : Number(localStorage.getItem('pageClick'));
    const matchedMenuItem = menuData.find(item => item.id === page_url);
    const matchedTitle = matchedMenuItem ? matchedMenuItem.title : 'Unknown';
    setPageTitle(encodeURIComponent(matchedTitle));
  }, [currentUrl, activePage, menuData]);

  useEffect(() => {
    if (subMenuData && Array.isArray(subMenuData)) {
      
      let subTitle;
        if (activeSubPageParent != null && gridView === true) {
         subTitle = subMenuData.find((item) => item.id === Number(activeSubPageParent));
        } else {
          subTitle = subMenuData.find((item) => item.id === playlist_id);
        }
       
      if (subTitle) {
        setPageSubTitle(encodeURIComponent(subTitle.title));
      }
    } else {
      setPageSubTitle(subMenuData);
    }
  }, [subMenuData, playlist_id]);

  const handleSeriesId = (seriesId) => {
    addLocalStorageData('seriesId', seriesId);
  }

  useEffect(() => {
    if (subMenuData && Array.isArray(subMenuData) && pageSubClick) {
      const matchedItem = subMenuData.find(item => item.id === Number(pageSubClick));
      if (matchedItem) {
        setSeriesSubTitle(encodeURIComponent(matchedItem.title));
      }
    }
  }, [subMenuData, pageSubClick]);

  useEffect(() => {
    const mainPoster = isPortrait ? posterV : posterH;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = mainPoster;
    document.head.appendChild(link);
  }, [posterV, posterH, isPortrait]);
 
  return (
    <div className={gridView ? "col-lg-4 col-md-6 col-12" : ""}>
      {isSeries === true && (
        <Link
          to={`/${pageTitle}/series/${seriesSubTitle}/${encodeURIComponent(title)}`}
          className={`media-element ${isPortrait ? 'portrait' : 'landscape'
            } prj-element`}
          data-focus-left={dataFocusLeft || false}
          data-focus-right={dataFocusRight || false}
          data-focus-up={dataFocusUp || false}
          data-focus-down={dataFocusDown || false}
          data-on-self-focus={dataOnSelfFocus || false}
          data-focus-pagination={dataOnPagination}
          onClick={() => {
            handleSeriesId(id);
            handleShowDetailPage({
              id: videoId,
              title,
              shortDescription,
              long_description,
              posterH,
              posterV,
              release_date,
              episode_count,
            });
          }}
          role="none"
        >
          <div className="img">
            <div className="overlay-box">
              <div className="btns-group">
                <button className='btn' type='button'>Details</button>
              </div>
            </div>
            <div className="img-container"
              style={{
                backgroundImage: `url(${placeholderImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <img
                id={`target-image-h-v-${videoId}`}
                src={optimizedPoster}
                alt={title}
                loading="eager"
                decoding="async"
                width={isPortrait ? 720 : 1280}
                height={isPortrait ? 1080 : 720}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  display: imageFailed ? "none" : "block",
                }}
                sizes="(max-width: 768px) 100vw, 50vw"
                srcSet={`
                  ${optimizedPoster}?width=480 480w,
                  ${optimizedPoster}?width=720 720w,
                  ${optimizedPoster}?width=1080 1080w
                `}
                onLoad={() => setImageLoading(false)}
                onError={(error) => fallbackImage(error, title, isPortrait)}
              />
            </div>
            {duration > 0 && showProgress > 0 && (
              <div className="progress-wrapper">
                <div className="progress-bar">
                  <span
                    className="progress-bar-fill"
                    style={{ width: `${showProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {isPortrait === true && imageFailed && (
            <div className="title-wrapper">
              <span className="error-title">{title}</span>
            </div>
          )}

          {type !== VIDEO_TYPES.MOVIES && <p className="title">{title}</p>}
          {type === VIDEO_TYPES.VIDEO && (
            <p className="sub-title">{description}</p>
          )}
        </Link>
      )}
      {isSeries === false && (() => {
        const isEvent = type === VIDEO_TYPES.EVENT;
        const date = startTime ? new Date(startTime) : null;
        const isValidDate = date && !isNaN(date.getTime());

        // Case 1: Event in the future → Upcoming (NO LINK)
        if (isEvent && isValidDate && date > new Date()) {
          return (
            <div className="media-element landscape prj-element upcoming_live_events_div">
              <span className="upcoming_text">Upcoming</span>
              <div className="img">
                <div className="overlay-box"></div>
                <div className="img-container"
                  style={{
                    backgroundImage: `url(${placeholderImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img
                    id={`target-image-h-v-${videoId}`}
                    src={optimizedPoster}
                    alt={title}
                    loading="eager"
                    decoding="async"
                    width={isPortrait ? 720 : 1280}
                    height={isPortrait ? 1080 : 720}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      display: imageFailed ? "none" : "block",
                    }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    srcSet={`
                      ${optimizedPoster}?width=480 480w,
                      ${optimizedPoster}?width=720 720w,
                      ${optimizedPoster}?width=1080 1080w
                    `}
                    onLoad={() => setImageLoading(false)}
                    onError={(error) => fallbackImage(error, title, isPortrait)}
                  />
                </div>
              </div>
              {type !== VIDEO_TYPES.MOVIES && <p className="title">{title}</p>}
              <div className="event-time">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" - "}
                {date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </div>
            </div>
          );
        }

        // Case 2: All others (EVENT On Now + MOVIES + VIDEO) → Link block
        return (
          <Link
            to={`/${pageTitle}/${pageSubTitle}/${encodeURIComponent(title)}`}
            className={`media-element ${isPortrait ? "portrait" : "landscape"} prj-element`}
            onClick={() =>
              handleShowDetailPage({
                id: videoId,
                playlist_id,
                title,
                description,
                poster,
                posterH,
                posterV,
                hlsUrl,
                genres,
                duration,
                category,
                channelId,
                director,
                actor1,
                actor2,
                actor3,
                rating,
                releaseDate,
                ratingSource,
                season,
                episode,
                srtUrl,
                vttUrl,
                source,
                playDirectUrl,
                liveVastUrl,
                isPortrait,
                monetization_type,
                monetization_price,
                monetization_duration,
                monetization_custom_duration,
                monetization_start_time,
                monetization_end_time,
              })
            }
          >
            {isEvent && <span className="single_live_text">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Live
              </span>}
            {/* ✅ Rest of Link block stays same */}
            <div className="img">
              <div className="overlay-box">
                <div className="btns-group">
                  <Link
                    to={`/watch/featured/${encodeURIComponent(title)}`}
                    className="btn" type='button'
                    data-focus-left="#resume-btn"
                    data-focus-right={false}
                    data-focus-up={false}
                    data-focus-down=".video.prj-element"
                    data-on-self-focus="#video-detail-focus"
                    onClick={() => {
                      sessionStorage.setItem("user_interacted", true)
                      handlePlayerOpen(false);
                    }}>
                    {type !== VIDEO_TYPES.MOVIES ? (
                      <div className="icon-parent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                          aria-label={`Play ${title} icon`}
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
                  {type !== VIDEO_TYPES.VIDEO && type !== VIDEO_TYPES.EVENT && (
                    <button className="btn" type='button'>Details</button>
                  )}
                  </div>
              </div>
              <div className="img-container"
                style={{
                  backgroundImage: `url(${placeholderImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  id={`target-image-h-v-${videoId}`}
                  src={optimizedPoster}
                  alt={title}
                  loading="eager"
                  decoding="async"
                  width={isPortrait ? 720 : 1280}
                  height={isPortrait ? 1080 : 720}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: imageFailed ? "none" : "block",
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  srcSet={`
                    ${optimizedPoster}?width=480 480w,
                    ${optimizedPoster}?width=720 720w,
                    ${optimizedPoster}?width=1080 1080w
                  `}
                  onLoad={() => setImageLoading(false)}
                  onError={(error) => fallbackImage(error, title, isPortrait)}
                />
              </div>
              {duration > 0 && showProgress > 0 && (
                <div className="progress-wrapper">
                  <div className="progress-bar">
                    <span
                      className="progress-bar-fill"
                      style={{ width: `${showProgress}%` }}
                      aria-label={`Progress: ${showProgress}% completed`}
                    />
                  </div>
                </div>
              )}
            </div>

            {type !== VIDEO_TYPES.MOVIES && <p className="title">{title}</p>}
            {type === VIDEO_TYPES.VIDEO && (
              <p className="sub-title">{description}</p>
            )}
          </Link>
        );
      })()}
    </div>
  );
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  videoId: PropTypes.number,
  description: PropTypes.string,
  shortDescription: PropTypes.string,
  hlsUrl: PropTypes.string,
  poster: PropTypes.string,
  posterH: PropTypes.string.isRequired,
  posterV: PropTypes.string.isRequired,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  duration: PropTypes.number,
  progress: PropTypes.number,
  genres: PropTypes.string,
  category: PropTypes.string,
  channelId: PropTypes.number,
  director: PropTypes.string,
  actor1: PropTypes.string,
  actor2: PropTypes.string,
  actor3: PropTypes.string,
  rating: PropTypes.string,
  releaseDate: PropTypes.string,
  ratingSource: PropTypes.string,
  season: PropTypes.number,
  episode: PropTypes.number,
  srtUrl: PropTypes.string,
  vttUrl: PropTypes.string,
  source: PropTypes.string,
  playDirectUrl: PropTypes.string,
  liveVastUrl: PropTypes.string,
  type: PropTypes.string,
  dataFocusLeft: PropTypes.string,
  dataFocusRight: PropTypes.string || PropTypes.boolean,
  dataFocusUp: PropTypes.string,
  dataFocusDown: PropTypes.string,
  dataOnSelfFocus: PropTypes.string,
  handleShowDetailPage: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  dataOnPagination: PropTypes.string,
};

export default Item;
