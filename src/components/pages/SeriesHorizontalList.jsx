/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';
import Item from './Item';
import { seriesPaginationData } from '../../services/channelData.service';
import { addLocalStorageData } from '../../utils/localCache.util';
import scrollAppView from '../../utils/viewScroll.util';
import Loading from '../common/Loading';
import { Link, useLocation } from 'react-router-dom';

const SeriesHorizontalList = ({
    id,
    title,
    containerId,
    videosCount,
    seriesCount,
    type,
    activePage,
    activeSubPage,
    videosList = [],
    menuData,
    subMenuData,
}) => {
    const location = useLocation();
    const scrollHandleButtonId = `scroll-${containerId}`;

    const [dataLoaded, setDataLoaded] = useState(false);
    const [series, setSeries] = useState(videosList);
    const [page, setPage] = useState(1);
    const [currentUrl, setCurrentUrl] = useState(location.pathname);
    const hasSaved = useRef(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 425);

    useEffect(() => {
        if (!hasSaved.current) {
            if (activePage !== '') {
                addLocalStorageData('pageClick', activePage);
            }
            hasSaved.current = true;
        }
        setCurrentUrl(currentUrl);
    }, [location, activePage]);

    useEffect(() => {
        if (activePage === '') {
            setDataLoaded(true);
            return;
        }

        if (currentUrl !== "/search") {
        seriesPaginationData(activePage, activeSubPage, 1, 20).then(
            (res) => {
                const response = res.content.series;
                const seriesData = [];
                response.forEach((s) => {
                    seriesData.push({
                        id: s.id,
                        title: s.title,
                        shortDescription: s.short_description || '',
                        long_description: s.long_description || '',
                        posterH: s.poster_16_9_small,
                        posterV: s.poster_9_16,
                        release_date: s.release_date || '',
                        episode_count: s.episode_count || '',
                    });
                });
                setSeries((prev) => {
                    const combined = [...prev, ...seriesData];
                    const uniqueById = new Map();
                    combined.forEach((item) => {
                      uniqueById.set(item.id, item);
                    });
                    return Array.from(uniqueById.values());
                  });
                setDataLoaded(true);
            }
        )
        } else {
            setSeries(videosList);
            setDataLoaded(true);
        }
    }, [activePage, activeSubPage]);

    useEffect(() => {
        const handleResize = () => {
          setIsMobileView(window.innerWidth <= 425);
        };
      
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleShowDetailPage = (data) => {
        if (window.document.getElementById('resume-btn')) {
            window.document.getElementById('resume-btn').classList.add('focused');
        } else if (window.document.getElementById('play-btn')) {
            window.document.getElementById('play-btn').classList.add('focused');
        }
    };

    const handleScroll = () => {
        const focusedElements = window.document.querySelectorAll(
            '.prj-element.focused'
        );
        if (focusedElements.length > 0) {
            scrollAppView(focusedElements[0]);
            if (window.document.querySelectorAll('.page-container')) {
                window.document.querySelectorAll(
                    '.page-container'
                )[0].style.marginTop = `107px`;
            }
            const currentFocus =
                focusedElements[0].dataset.focusPagination.split('-')[0];
            if (Number(currentFocus) === series.length - 9) {
                setPage(page + 1);
            }
        }
    };

    if (!dataLoaded) {
        return <Loading showVideo={false} />;
    }

    return (
        <>
            {series.length > 0 && (
                <div className="horizontal-list" id={containerId} role="none">
                    <button
                        type="button"
                        className="hide"
                        id={scrollHandleButtonId}
                        onClick={handleScroll}
                    >
                        Scroll
                    </button>
                    <div className='grid_title_see_more'>
                        <div className="grid-title" id={type}>
                            {title}
                        </div>

                        {currentUrl !== "/search" && (
                            <Link to={`/series/details/${encodeURIComponent(title)}`} className='see_more_options' id={type}>
                                See More {isMobileView ? '' : title}
                            </Link>
                        )}
                    </div>
                    <Swiper
                        onBeforeInit={() => setPage(page + 1)}
                        onNavigationNext={() => setPage(page + 1)}
                        className="mySwiper"
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        navigation
                        breakpoints={{
                            320: {
                                slidesPerView: type === 'movies' ? 1 : 1,
                                spaceBetween: 20,
                            },
                            640: {
                                slidesPerView: type === 'movies' ? 2 : 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: type === 'movies' ? 3 : 3,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: type === 'movies' ? 4 : 3,
                                spaceBetween: 20,
                            },
                            1366: {
                                slidesPerView: type === 'movies' ? 6 : 5,
                                spaceBetween: 20,
                            }
                        }}
                        onMouseOver={() => console.log('mouse hover**')}
                        id={"series"}
                    >
                        <div className={`media-scroller video`}>
                            {series.map((s, idx) => (
                                <React.Fragment key={`media-scroller${id}v${s.id}`}>
                                    <SwiperSlide
                                        key={`media-scroller${id}v${s.id}${Math.random(1000)}`}
                                    >
                                        <Item
                                            key={`${id}gridv${s.id}idx${idx}`}
                                            id={`item${id}gridv${s.id}`}
                                            videoId={s.id}
                                            title={s.title}
                                            shortDescription={s.shortDescription}
                                            long_description={s.long_description}
                                            posterH={s.posterH}
                                            posterV={s.posterV}
                                            release_date={s.release_date}
                                            episode_count={s.episode_count}
                                            seriesCount
                                            videosCount
                                            menuData={menuData}
                                            subMenuData={subMenuData}
                                            isSeries={true}
                                            dataFocusLeft={
                                                idx % 2 === 0
                                                    ? '.side-nav .prj-element.active'
                                                    : `#item${id}gridv${series[idx - 1]?.id}`
                                            }
                                            dataFocusRight={
                                                idx % 2 === 0 ? `#item${id}gridv${series[idx + 1]?.id}` : null
                                            }
                                            dataFocusUp={
                                                idx < 2
                                                    ? '.top-navigation .prj-element.active'
                                                    : `#item${id}gridv${series[idx - 2]?.id}`
                                            }
                                            dataFocusDown={
                                                idx > series.length - 3
                                                    ? ''
                                                    : `#item${id}gridv${series[idx + 2]?.id}`
                                            }
                                            dataOnSelfFocus={`#${scrollHandleButtonId}`}
                                            handleShowDetailPage={handleShowDetailPage}
                                            dataOnPagination={`${idx}-${containerId}`}
                                            activePage={activePage}
                                            activeSubPage={activeSubPage}
                                            onClick={() => {
                                                const series_id = `${id}gridv${s.id}idx${idx}`;
                                                addLocalStorageData("seriesId", series_id);
                                              }}
                                        />
                                    </SwiperSlide>
                                    <div className="extra-margin-div" />
                                </React.Fragment>
                            ))}
                        </div>
                    </Swiper>
                </div>
            )}
        </>
    );
};

SeriesHorizontalList.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    containerId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    activePage: PropTypes.string.isRequired,
    activeSubPage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    videosList: PropTypes.arrayOf(PropTypes.shape()),
    keyUpElement: PropTypes.string.isRequired,
    keyDownElement: PropTypes.string.isRequired,
};

export default SeriesHorizontalList;
