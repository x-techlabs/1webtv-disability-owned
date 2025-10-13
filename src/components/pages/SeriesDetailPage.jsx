
/* eslint-disable consistent-return */
/* eslint-disable react/no-unknown-property */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import DetailLayout from '../../layout/Detail';
import Player from '../common/Player';
import { getUserVideoProgress } from '../../utils/localCache.util';
import { ArrowLeftIcon, PauseIcon, PlayIcon } from '@heroicons/react/16/solid';
import scrollAppView from '../../utils/viewScroll.util';
import TopMenu from '../common/TopMenu';
import EpisodesTabs from './EpisodesTabs';
import landscape_dummy_poster from "../../assets/images/landscape_dummy_poster.png";
import portrait_dummy_poster from "../../assets/images/portrait_dummy_poster.png";

const SeriesDetailPage = ({
    detailPageData,
    handleHideDetailPage,
    containerIdPrefix,
    setShowDetailPage,
    activePage,
    activeSubPage,
    menuData,
    handlePageChange,
    activePageLayoutType,
}) => {
    const initialUrl = useRef(null);
    const [showPlayer, setShowPlayer] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [videoData, setVideoData] = useState([]);
    const [showPlayerFromProgress, setShowPlayerFromProgress] = useState(false);

    const scrollHandleButtonId = `scroll-element-${containerIdPrefix}`;

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

    const fallbackImage = (error, titleName, isPortrait) => {
        if (error?.target) {
            error.target.src = isPortrait ? portrait_dummy_poster : landscape_dummy_poster;
            error.target.alt = titleName;
            error.target.className = isPortrait ? 'error-image-default-image portrait' : 'error-image-default-image landscape';
        }
        return error;
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

    const clickOnBackButton = () => {
        window.history.back(); 
    };

    return (
        <DetailLayout>
            <TopMenu
                menuData={menuData}
                activePage={activePage}
                handlePageChange={handlePageChange}
                activePageLayoutType={activePageLayoutType}
            />
            <div className='main-cont'>
                <div className="bg-poster" style={{ backgroundImage: `url("${detailPageData.posterH}")` }} />
                <button type="button" className="hide" id="video-detail-focus" onClick={handleScroll}>
                    Scroll
                </button>
                <div className="bg-poster-layer" />

                <div className="back-to-page prj-element" id="back-to-page" onClick={() => {sessionStorage.removeItem('initialUrl'); clickOnBackButton()}}>
                    <ArrowLeftIcon className="" />
                </div>
                <div className={detailPageData.isPortrait ? 'video-details-main-div movies' : 'video-details-main-div videos'} id="video-detail-focus" >
                    <div className='video-details'>
                        <div className="image">
                            <div className={`image-wrap portrait`}>
                                <img src={detailPageData.isPortrait ? detailPageData.posterV : detailPageData.posterH} alt={detailPageData.title} onError={(error) => fallbackImage(error, detailPageData.title, detailPageData.isPortrait)}/>
                            </div>
                        </div>
                        <div className="details">
                            <div className="series-title title">{detailPageData.title}</div>
                            <p className="sub-title">{detailPageData.long_description}</p>
                            {detailPageData.releaseDate && (
                                <span className="video-details-release-date">
                                    {detailPageData.releaseDate.split('-')[0]}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="series-detail-page">
                        <div className='series-total-videos-count'>
                            {detailPageData.episodes && (
                                <span className="video-details-release-date">
                                    {detailPageData.episodes.length} Episodes
                                </span>
                            )}
                        </div>

                        {detailPageData.episodes.length > 0 && (
                            <EpisodesTabs episodes={detailPageData.episodes} />
                        )}
                    </div>
                </div>

                {showPlayer && (
                    <Player
                        id="player"
                        videoData={videoData}
                        resumeFrom={showPlayerFromProgress ? currentProgress : 0}
                        handlePlayerClose={handlePlayerClose}
                        setShowDetailPage={setShowDetailPage}
                    />
                )}
            </div>
        </DetailLayout >
    );
};

SeriesDetailPage.propTypes = {
    detailPageData: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        long_description: PropTypes.string,
        short_description: PropTypes.string,
        posterH: PropTypes.string,
        posterV: PropTypes.string,
        isPortrait: PropTypes.bool,
        episodes: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
        type: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }),
    handleHideDetailPage: PropTypes.func,
    setShowDetailPage: PropTypes.func,
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
    ),
    containerIdPrefix: PropTypes.string.isRequired,
};

export default SeriesDetailPage;
