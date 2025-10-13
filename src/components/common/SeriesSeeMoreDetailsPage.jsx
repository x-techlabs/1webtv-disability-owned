import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getMenuDetails,  seriesPaginationData } from "../../services/channelData.service";
import { getLocalStorageData } from "../../utils/localCache.util";
import Item from "../pages/Item";
import Loading from "./Loading";
import TopMenu from "./TopMenu";
import loadingImg from '../../assets/images/icons/Spinner-1s-200px-animated.svg';

const SeriesSeeMoreDetailsPage = ({ activePage, activePageLayout, handlePageChange, menuData }) => {
    const loaderRef = useRef(null);
    const { seeMoreTitle } = useParams();
    const [detailData, setDetailData] = useState([]);
    const [type, setType] = useState('');
    const [activeSubPage, setActiveSubPage] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [seriesCount, setSeriesCount] = useState(0);

    const [playlistId, setPlaylistId] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsFirstLoad(true);
                const storedPlaylistId = getLocalStorageData('pageClick');
                setPlaylistId(storedPlaylistId);

                const menuData = await getMenuDetails(storedPlaylistId);
                
                const normalizeTitle = (title) => encodeURIComponent(title);

                const playlists = menuData?.content?.playlists || [];
                const matchingPlaylist = playlists.find(
                    (playlist) => normalizeTitle(playlist.title) === seeMoreTitle
                );

                if (!matchingPlaylist) return;

                setSeriesCount(matchingPlaylist.series_count || 0);
                
                const categoryId = matchingPlaylist._id;
                setType(matchingPlaylist?.program_type ?? 'video');
                setActiveSubPage(categoryId);

                setDetailData([]);
                setPage(1);
                setHasMore(true);

                await seriesData(storedPlaylistId, categoryId);
            } catch (error) {
                // console.error("Error initializing video data:", error);
            } finally {
                setIsFirstLoad(false);
            }
        };

        fetchInitialData();
    }, [seeMoreTitle]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting && hasMore && !loading && playlistId && activeSubPage) {
                    seriesData(playlistId, activeSubPage, page);
                }
            },
            { threshold: 1 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) observer.observe(currentLoader);

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasMore, loading, page, playlistId, activeSubPage]);

    const seriesData = async (playlistId, categoryId, pageNum = 1) => {
        try {
            setLoading(true);
            const perPage = 20;
            const seriesDetails = await seriesPaginationData(playlistId, categoryId, pageNum, perPage);
            const newSeries = seriesDetails?.content?.series || [];
            setDetailData((prev) => [...prev, ...newSeries]);
            setPage((prevPage) => prevPage + 1);

            if (newSeries.length < perPage) {
                setHasMore(false);
            }
        } catch (error) {
            // console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowDetailPage = (data) => {
    };

    if (detailData.length === 0 && !loading) {
        return <Loading showVideo={false} />;
    }

    return (
        <div className="app-container">
            <TopMenu
                menuData={menuData}
                activePage={activePage}
                handlePageChange={handlePageChange}
                activePageLayout={activePageLayout}
            />
            <div className="page-container main-no-video-show">
                <div className="page-content" id="page-content">
                    <div className="horizontal-list">
                        {detailData.length > 0 && (
                            <div className="video-list">
                                <div className="row row-gap-3">
                                    {detailData.map((s, idx) => (
                                        <div key={`wrapper-${s._id}-${idx}`} className={type === false ? "col-lg-4 col-12" : "col-xl-2 col-sm-3 col-12"}>
                                            <Item
                                                key={`item${s.id}s${s.id}idx${idx}gridv${s.id}`}
                                                id={`item${s.id}s${s.id}gridv${s.id}`}
                                                videoId={s.id}
                                                title={s.title}
                                                shortDescription={s.shortDescription}
                                                long_description={s.long_description}
                                                posterH={s.poster_16_9_small}
                                                posterV={s.poster_9_16}
                                                release_date={s.release_date}
                                                episode_count={s.episode_count}
                                                seriesCount={seriesCount}
                                                type={type}
                                                menuData={menuData}
                                                isSeries={true}
                                                dataFocusLeft={
                                                    idx === 0
                                                        ? '.side-nav .prj-element.active'
                                                        : `#item${detailData[idx - 1]._id}v${detailData[idx - 1].id}`
                                                }
                                                dataFocusRight={
                                                    idx + 1 === detailData.length
                                                        ? ''
                                                        : `#item${detailData[idx + 1]._id}v${detailData[idx + 1].id}`
                                                }
                                                dataFocusUp=""
                                                dataFocusDown=""
                                                activePage={activePage}
                                                activeSubPage={activeSubPage}
                                                handleShowDetailPage={handleShowDetailPage}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={loaderRef} style={{ height: "1px" }} />
                        {loading && (
                            <div className={`load_more_spinner ${isFirstLoad ? 'initial-loader' : ''}`}>
                                <img
                                    src={loadingImg}
                                    className="web-loader-load-more-spinner"
                                    alt="web-loader"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeriesSeeMoreDetailsPage;
