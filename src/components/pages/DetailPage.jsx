/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable consistent-return */
/* eslint-disable react/no-unknown-property */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import videojs from 'video.js';
import DetailLayout from '../../layout/Detail';
// import Player from '../common/Player';
import { getUserVideoProgress } from '../../utils/localCache.util';
import playIcon from '../../assets/images/icons/play.png';
import resumeIcon from '../../assets/images/icons/resume.png';
import scrollAppView from '../../utils/viewScroll.util';
import { Link, useParams, useLocation ,useNavigate} from 'react-router-dom';
import LoginModal from './modal/LoginModal';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import PaymentPendingModal from './modal/PaymentPendingModal';
import axios from 'axios';
import TopMenu from '../common/TopMenu';
import { ArrowLeftIcon, PauseIcon, PlayIcon } from '@heroicons/react/16/solid';
import landscape_dummy_poster from "../../assets/images/landscape_dummy_poster.webp";
import portrait_dummy_poster from "../../assets/images/portrait_dummy_poster.webp";

const DetailPage = ({
  detailPageData: initialDetailPageData,
  handleHideDetailPage,
  videos,
  containerIdPrefix,
  setShowDetailPage,
  activePage: initialActivePage,
  activeSubPage: initialActiveSubPage,
  menuData,
  handlePageChange,
  activePageLayoutType,
}) => {
  const { videoTitle } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialUrl = useRef(null);
  const [detailPageData, setDetailPageData] = useState(initialDetailPageData);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [activePage, setActivePage] = useState(initialActivePage);
  const [activeSubPage, setActiveSubPage] = useState(initialActiveSubPage);
  const [showPlayerFromProgress, setShowPlayerFromProgress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  // const [activeSwiperSlide, setActiveSwiperSlide] = useState(7);
  const [canPlay, setCanPlay] = useState(false);

  const scrollHandleButtonId = `scroll-element-${containerIdPrefix}`;
  // const moreLikeThis = videos.filter((a) => a.title !== detailPageData.title);
  window.scrollTo(0, 0);

  const currentTime = new Date();
  const startTime = new Date(detailPageData.monetization_start_time);
  const endTime = new Date(detailPageData.monetization_end_time);
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return '';
    }
    return date.toISOString().split('T')[0];
  };

  const isBeforeStartTime = formatDate(currentTime) < formatDate(startTime);
  const isAfterEndTime = formatDate(currentTime) > formatDate(endTime);
  
  const handleBack = (e) => {
    e.preventDefault(); // prevent Link's default navigation
    sessionStorage.removeItem("initialUrl");
    navigate(-1); // go back to previous page
  };

  useEffect(() => {
    if (!initialUrl.current) {
      const storedInitialUrl = sessionStorage.getItem('initialUrl');
      if (storedInitialUrl) {
        initialUrl.current = storedInitialUrl;
      } else {
        initialUrl.current = location.pathname;
        sessionStorage.setItem('initialUrl', initialUrl.current);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('detailPageData')) || {};
    const decodedTitle = decodeURIComponent(videoTitle);
    const videoData = storedData.videos?.find(
      (video) => video.title.toLowerCase() === decodedTitle.toLowerCase()
    );
    if (videoData) {
      setDetailPageData((prevData) => ({
        ...prevData,
        ...videoData,
      }));
    }
  }, [videoTitle]);

  useEffect(() => {
    try {
      if (window.document.getElementById('bg-video-player')) {
        videojs('bg-player').pause();
      }
    } catch (e) {
    }
  }, [videos]);

  useEffect(() => {
    const playlistId = window.location.pathname.split('/')[2];
    const playlistCategoryId = window.location.pathname.split('/')[3];
    setActivePage(playlistId);
    setActiveSubPage(playlistCategoryId);
  }, []);

  useEffect(() => {
    const myProgress = getUserVideoProgress(detailPageData.id);
    if (myProgress > 0) {
      setCurrentProgress(Math.ceil(Number(myProgress)));
    } else {
      setCurrentProgress(0);
    }
    setShowButtons(true);
  }, [detailPageData.id]);

  useEffect(() => {
    const combinedData = { detailPageData, videos, containerIdPrefix, activePage };
    localStorage.setItem('detailPageData', JSON.stringify(combinedData));
  }, [detailPageData, videos, containerIdPrefix, activePage]);

  useEffect(() => {
    const user_details = async () => {
      const login_session = Cookies.get('login_session');
      if (login_session) {
        try {
          const decodedToken = jwtDecode(login_session);
          const userDetails = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${decodedToken.sub}?video_id=${detailPageData.id}`);
          if (userDetails.data.is_video_accessable === true) {
            setShowPaymentModal(false);
            setCanPlay(true);
          } else {
            (detailPageData.monetization_type === 'Free' || isAfterEndTime || isBeforeStartTime) ?
            setShowPaymentModal(false) : setShowPaymentModal(true);
            setCanPlay(false);
          }
          setUserDetails(userDetails.data.user_details);
        } catch (error) {
        }
      }
    }
    user_details();
  }, [detailPageData.id]);

  const handlePlayerOpen = (fromProgress) => {
    setShowPlayerFromProgress(fromProgress);
    setShowPlayer(true);
    document.querySelectorAll('.more-like-this').forEach(element => element.style.display = "none");
    document.querySelectorAll('.video-details').forEach(element => element.style.display = "none");
  };
  const handlePlayerClose = () => {
    setShowPlayer(false);
    const myProgress = getUserVideoProgress(detailPageData.id);
    if (myProgress > 0) {
      setCurrentProgress(Math.ceil(Number(myProgress)));
    } else {
      setCurrentProgress(0);
    }
    setShowDetailPage(true);
  };

  const handleScroll = () => {
    const focusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );

    if (focusedElements.length > 0) {
      if (focusedElements[0].id === 'resume-btn') {
      } else if (detailPageData.isPortrait === true) {
        window.document.querySelectorAll(
          '.video-details'
        )[0].style.marginTop = `195px`;
      } else if (detailPageData.isPortrait === false) {
        window.document.querySelectorAll(
          '.video-details'
        )[0].style.marginTop = `239px`;
      }
    }
  };

  const handleScrollEle = () => {
    const focusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );

    if (focusedElements.length > 0) {
      scrollAppView(focusedElements[0]);
      window.document.querySelectorAll(
        '.video-details'
      )[0].style.marginTop = `-190px`;
    }
  };

  const fallbackImage = (error, titleName) => {
    const errorElement = window.document.getElementById(error.target.id);
    if (error?.target) {
      errorElement.outerHTML = `<img src="${detailPageData.isPortrait ? portrait_dummy_poster : landscape_dummy_poster}" alt="${titleName}" class="${detailPageData.isPortrait ? 'error-image-default-image portrait' : 'error-image-default-image landscape'}"/>`;
    }
    return error;
  };

  const toHoursAndMinutes = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      if (minutes === 0) {
        return `${seconds}s`;
      }
      return `${minutes}m ${seconds}s`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleButtonClick = async () => {
    const login_session = Cookies.get('login_session');
    if (login_session) {
      try {
        const decodedToken = jwtDecode(login_session);
        const userDetails = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${decodedToken.sub}`);
        if (userDetails.data.user_details.video_bought === '1' && Number(userDetails.data.user_details.video_id) === detailPageData.id) {
          setShowPaymentModal(false);
          setCanPlay(true);
        } else {
          setShowPaymentModal(true);
          setCanPlay(false);
        }
        setUserDetails(userDetails.data.user_details);
      } catch (error) {
      }
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closePendingModal = () => {
    setShowPaymentModal(false);
  };

  const handleLoginSuccess = async (token) => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userDetails = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${decodedToken.sub}`);
        if (userDetails.data.user_details.video_bought === '1' && Number(userDetails.data.user_details.video_id) === detailPageData.id) {
          setShowPaymentModal(false);
          setCanPlay(true);
        } else {
          setShowPaymentModal(true);
          setCanPlay(false);
        }
        setUserDetails(userDetails.data.user_details);
      } catch (error) {
      }
    } else {
      setShowModal(true);
    }
  }

  return (
    <DetailLayout>
      <>
      <TopMenu
        menuData={menuData}
        activePage={activePage}
        handlePageChange={handlePageChange}
        activePageLayoutType={activePageLayoutType}
      />
      <div className='main-cont'>
        <div
          className="bg-poster"
          style={{ backgroundImage: `url("${detailPageData.posterH}")` }}
        />
        <button
          type="button"
          className="hide"
          id="video-detail-focus"
          onClick={handleScroll}
        >
          Scroll
        </button>
        <div className="bg-poster-layer" />

        <Link to={`/`}
          className="back-to-page prj-element"
          id="back-to-page"
          //onClick={() => sessionStorage.removeItem('initialUrl')}
          onClick={handleBack}
          >
          <ArrowLeftIcon className="" />
        </Link>
        <div
          className={
            detailPageData.isPortrait
              ? 'video-details-main-div movies'
              : 'video-details-main-div videos'
          }
          id="video-detail-focus"
        >
          <div className="video-details">   
            <div className="image">
              <div
                className={`image-wrap ${
                  detailPageData.isPortrait ? 'portrait' : 'landscape'
                }`}
              >
                <img
                  id={`target-image-h-v-${detailPageData.id}`}
                  src={
                    detailPageData.isPortrait
                      ? detailPageData.posterV
                      : detailPageData.posterH
                  }
                  alt={detailPageData.title}
                  onError={(error) => fallbackImage(error, detailPageData.title, detailPageData.isPortrait)}
                />
              </div>
            </div>           
            <div className="details">
              <div className="title">{detailPageData.title}</div>
              <div className="flex-box">
              {detailPageData.releaseDate?.trim() && (
                <span className="video-details-release-date">
                  ({detailPageData.releaseDate.split('-')[0]})
                </span>
              )}

              {/* {detailPageData.rating ? <span>&bull;</span> : ''} */}
              {detailPageData.rating?.trim() && (
                <div className="video-rating">
                  <span>{detailPageData.rating}</span>
                </div>
              )}
              {Number(detailPageData.duration) > 0 && (
                <>
                  {/* {detailPageData.releaseDate && <span>&bull;</span>} */}
                  <span className="video-details-duration">
                    {toHoursAndMinutes(Number(detailPageData.duration))}
                  </span>
                </>
              )}
              </div>
              
              <div className="description">{detailPageData.description}</div>
              <div className="video-rating">
                {detailPageData.director && (
                  <>
                    <h5 className='m-0'>Directors: </h5>
                    <span>{detailPageData.director}</span>
                  </>
                )}
              </div>
              <div className="actor-section">
              {(detailPageData.actor1 || detailPageData.actor2 || detailPageData.actor3) && (
                <h5 className='m-0'>Cast: </h5>
              )}
            {detailPageData.actor1 && (
              <span className="detail-page-actor1">
                {detailPageData.actor1}
              </span>
            )}
            {detailPageData.actor2 && (
              <>
                {detailPageData.actor1 && (
                  <span className="detail-page-vertical-line">&#124;</span>
                )}
                <span className="detail-page-actor2">
                  {detailPageData.actor2}
                </span>
              </>
            )}
            {detailPageData.actor3 && (
              <>
                {detailPageData.actor1 || detailPageData.actor2 ? (
                  <span className="detail-page-vertical-line">&#124;</span>
                ) : (
                  ''
                )}
                <span className="detail-page-actor3">
                  {detailPageData.actor3}
                </span>
              </>
            )}
          </div>
              {showButtons && (
                <div className="buttons">
                      {Number(currentProgress) > 0 && Number(detailPageData.duration) - Number(currentProgress) > 2 && (
                        <Link 
                          to={`/watch/featured/${encodeURIComponent(detailPageData.title)}`}
                          id="resume-btn"
                          type="button"
                          className="play-btn prj-element"
                          data-focus-left={false}
                          data-focus-right="#play-btn"
                          data-focus-up={false}
                          data-focus-down=".video.prj-element"
                          alt={detailPageData.title}
                          aria-label={'Resume video'}
                          data-on-self-focus="#video-detail-focus"
                          onClick={sessionStorage.setItem("user_interacted", true)}
                          >
                          <img src={resumeIcon} alt="resume" />
                          Resume from {toHoursAndMinutes(currentProgress)}
                        </Link>
                      )}
                      <Link
                        to={`/watch/featured/${encodeURIComponent(detailPageData.title)}`}
                        id="play-btn"
                        className={
                          currentProgress === 0
                            ? 'play-btn small prj-element '
                            : 'play-btn prj-element beginning-btn '
                        }
                        data-focus-left="#resume-btn"
                        data-focus-right={false}
                        data-focus-up={false}
                        data-focus-down=".video.prj-element"
                        data-on-self-focus="#video-detail-focus"
                        aria-label={currentProgress === 0 ? 'Play' : 'Play from beginning'}
                        state={{ play_from_beginning: true }}
                        onClick={sessionStorage.setItem("user_interacted", true)}
                      >
                        <img src={playIcon} alt="play" />
                        {Number(currentProgress) > 0 && Number(detailPageData.duration) - Number(currentProgress) > 2  ? 'Play from beginning' : 'Play'}
                      </Link>
                </div>
              )}
            </div>
          </div>

          {videos.length > 1 && (
            <div className="more-like-this">
              <button
                type="button"
                className="hide"
                id={scrollHandleButtonId}
                onClick={handleScrollEle}
              >
                Scroll
              </button>
            </div>
          )}

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <p className="login_modal_close_btn" onClick={closeModal}>&times;</p>
                <LoginModal closeModal={closeModal} onLoginSuccess={handleLoginSuccess} />
              </div>
            </div>
          )}
          {showPaymentModal && (
            <div className="modal">
              <div className="modal-content">
                <p className="payment_pending_modal_close_btn" onClick={closePendingModal}>&times;</p>
                <PaymentPendingModal closeModal={closeModal} price={`${detailPageData.monetization_price}`} video_id={`${detailPageData.id}`} valid_date={`${detailPageData.monetization_duration}`} video_name={`${detailPageData.title}`} video_access_start_time={`${detailPageData.monetization_start_time}`} video_access_end_time={`${detailPageData.monetization_end_time}`}/>
              </div>
            </div>
          )}
        </div>
      </div>
      </>
    </DetailLayout>
  );
};

DetailPage.propTypes = {
  detailPageData: PropTypes.shape({
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
    releaseDate: PropTypes.string,
    ratingSource: PropTypes.string,
    season: PropTypes.number,
    episode: PropTypes.number,
    srtUrl: PropTypes.string,
    vttUrl: PropTypes.string,
    source: PropTypes.string,
    playDirectUrl: PropTypes.string,
    liveVastUrl: PropTypes.string,
  }).isRequired,
  handleHideDetailPage: PropTypes.func.isRequired,
  setShowDetailPage: PropTypes.func.isRequired,
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      shortDescription: PropTypes.string,
      hlsUrl: PropTypes.string,
      poster: PropTypes.string,
      posterH: PropTypes.string,
      posterV: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      duration: PropTypes.number,
      type: PropTypes.string,
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
    })
  ).isRequired,
  containerIdPrefix: PropTypes.string.isRequired,
};

export default DetailPage;
