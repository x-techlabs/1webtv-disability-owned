/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { VIDEO_TYPES } from '../../config/const.config';
import convertSecToTime from '../../utils/timeformat.util';
import { addLocalStorageData } from '../../utils/localCache.util';
import landscape_dummy_poster from "../../assets/images/landscape_dummy_poster.png";
import portrait_dummy_poster from "../../assets/images/portrait_dummy_poster.png";

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

  const fallbackImage = (error, titleName) => {
    const errorElement = window.document.getElementById(error.target.id);
    if (error?.target) {
      errorElement.outerHTML = `<img src="${isPortrait ? portrait_dummy_poster : landscape_dummy_poster}" alt="${titleName}" class="${isPortrait ? 'error-image-default-image portrait' : 'error-image-default-image landscape'}"/>`;
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
      if (activeSubPageParent != null) {
         subTitle = subMenuData.find((item) => item.id === Number(activeSubPageParent));
        } else {
          subTitle = subMenuData.find((item) => item.id === playlist_id);
        }
       
      //const subTitle = subMenuData.find((item) => item.id === playlist_id);
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
            <div className="img-container">
              <img
                id={`target-image-h-v-${videoId}`}
                src={isPortrait ? posterV : posterH}
                alt={title}
                loading="lazy"
                onError={(error) => fallbackImage(error, title)}
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

          {type !== VIDEO_TYPES.MOVIES && <p className="title">{title}</p>}
          {type === VIDEO_TYPES.VIDEO && (
            <p className="sub-title">{description}</p>
          )}
        </Link>
      )}
      {isSeries === false && (
      <Link
        to={`/${pageTitle}/${pageSubTitle}/${encodeURIComponent(title)}`}
        className={`media-element ${
          isPortrait ? 'portrait' : 'landscape'
        } prj-element`}
        data-focus-left={dataFocusLeft || false}
        data-focus-right={dataFocusRight || false}
        data-focus-up={dataFocusUp || false}
        data-focus-down={dataFocusDown || false}
        data-on-self-focus={dataOnSelfFocus || false}
        data-focus-pagination={dataOnPagination}
        onClick={() => {
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
          });
        }}
        role="none"
      >
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
              {type !== VIDEO_TYPES.VIDEO && (
                <button className="btn" type='button'>Details</button>
              )}
            </div>
          </div>
          <div className="img-container">
            <img
              id={`target-image-h-v-${videoId}`}
              src={isPortrait ? posterV : posterH}
              alt={title}
              loading="lazy"
              onError={(error) => fallbackImage(error, title)}
            />
          </div>
          {/* {type === VIDEO_TYPES.VIDEO && (
            <div className="video-duration">{convertSecToTime(duration)}</div>
          )} */}
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

        {type !== VIDEO_TYPES.MOVIES && <p className="title">{title}</p>}
        {type === VIDEO_TYPES.VIDEO && (
          <p className="sub-title">{description}</p>
        )}
      </Link>
      )}
    </div>
  );
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
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
  handleShowDetailPage: PropTypes.func,
  dataOnPagination: PropTypes.string,
};

export default Item;
