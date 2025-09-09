import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getMenuDetails, getMenuVideoDetails, seriesPaginationData } from "../../services/channelData.service";
import { getLocalStorageData } from "../../utils/localCache.util";
import Item from "../pages/Item";
import loadingImg from '../../assets/images/icons/Spinner-1s-200px-animated.svg';
import TopMenu from "../common/TopMenu";
import Loading from "../common/Loading";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { useLocation } from 'react-router-dom';

const SeeMoreDetailsPage = ({ activePage, activePageLayout, handlePageChange, menuData }) => {
    const loaderRef = useRef(null);
    const { seeMoreTitle } = useParams();
    const [detailData, setDetailData] = useState([]);
    const [videoProgress, setVideoProgress] = useState({});
    const [type, setType] = useState('');
    const [activeSubPage, setActiveSubPage] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const [playlistId, setPlaylistId] = useState(null);

    const location = useLocation();
    const activeSubPageParentId = location.state?.activeSubPageParent;
  
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsFirstLoad(true);
                const storedPlaylistId = getLocalStorageData('pageClick');
                setPlaylistId(storedPlaylistId);

                let menuData;
                if (activeSubPageParentId != null) {
                menuData = await getMenuDetails(activeSubPageParentId);
                } else {
                menuData = await getMenuDetails(storedPlaylistId);
                }
               
                const playlists = menuData?.content?.playlists || [];
                const matchingPlaylist = playlists.find( 
                    (playlist) => playlist.title === seeMoreTitle
                );

                if (!matchingPlaylist) return;

                const categoryId = matchingPlaylist._id;
                setType(matchingPlaylist?.program_type ?? 'videos');
                setActiveSubPage(categoryId);

                setDetailData([]);
                setPage(1);
                setHasMore(true);

                await fetchVideosAndSeries(storedPlaylistId, categoryId, 1);
            } catch (error) {
                console.error("Error initializing video data:", error);
            } finally {
                setIsFirstLoad(false);
            }
        };

        fetchInitialData();
    }, [seeMoreTitle]);

    const fetchVideosAndSeries = async (playlistId, categoryId, pageNum = 1) => {
        try {
            setLoading(true);
            const perPage = 20;
            const videoDetails = await getMenuVideoDetails(playlistId, categoryId, pageNum, perPage);
            const videos = videoDetails?.content?.videos || [];
            const videoData = videos.map((v) => ({
                ...v,
                isSeries: false,
            }));

            const seriesDetails = await seriesPaginationData(playlistId, categoryId, pageNum, perPage);
            const series = seriesDetails?.content?.series || [];
            const seriesData = series.map((s) => ({
                ...s,
                isSeries: true,
            }));

            let combinedData = [...videoData, ...seriesData];

            if (combinedData.length > 20) {
                combinedData = combinedData.slice(0, 20);
            }

            const uniqueById = new Map();
            combinedData.forEach((item) => uniqueById.set(item.id || item._id, item));

            setDetailData((prev) => [...prev, ...Array.from(uniqueById.values())]);
            setPage((prevPage) => prevPage + 1);

            if (combinedData.length < 20) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching videos and series:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting && hasMore && !loading && playlistId && activeSubPage) {
                    fetchVideosAndSeries(playlistId, activeSubPage, page);
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

    const handleShowDetailPage = (data) => {
    };

    if (detailData.length === 0 && !loading) {
        return <Loading showVideo={false} />;
    }

    const clickOnBackButton = () => {
        window.history.back(); 
    };

    return (
        <div className="app-container detailPage">
            <TopMenu
                menuData={menuData}
                activePage={activePage}
                handlePageChange={handlePageChange}
                activePageLayout={activePageLayout}
            />
            <div className="see-more-details-page">
            <div className="back-to-page prj-element" id="back-to-page" onClick={() => {sessionStorage.removeItem('initialUrl'); clickOnBackButton()}}>
                <ArrowLeftIcon className="" />
                <div className="grid-title">
                {seeMoreTitle
                    ?.replace(/_/g, " ")              // replace all underscores with spaces
                    .replace(/\b\w/g, char => char.toUpperCase())}  
                </div>
               
            </div>
            
            <div className="page-container main-no-video-show">
                <div className="page-content" id="page-content">
                    <div className="horizontal-list">
                        {detailData.length > 0 && (
                            <div className="video-list">
                                <div className="row row-gap-3">
                                    {detailData.map((v, idx) => (
                                        <div key={`wrapper-${v._id}-${idx}`} className={type === false ? "col-lg-4 col-12" : "col-xl-2 col-sm-3 col-12"}>
                                            <Item
                                                key={`item${v._id}v${v._id}idx${idx}`}
                                                id={`item${v._id}v${v._id}`}
                                                videoId={v.isSeries === true ? v.id : v._id}
                                                title={v.title}
                                                description={v.description}
                                                shortDescription={v.shortDescription}
                                                hlsUrl={v.hlsUrl}
                                                poster={v.poster}
                                                posterH={v.isSeries === true ? v.poster_16_9_small : v.poster_16_9}
                                                posterV={v.poster_9_16}
                                                startTime={v.startTime}
                                                endTime={v.endTime}
                                                duration={v.duration}
                                                progress={Number(videoProgress[v.id] || 0)}
                                                genres={v.genres}
                                                category={v.category}
                                                channelId={v.channelId}
                                                director={v.director}
                                                actor1={v.actor1}
                                                actor2={v.actor2}
                                                actor3={v.actor3}
                                                rating={v.rating}
                                                ratingSource={v.ratingSource}
                                                releaseDate={v.releaseDate}
                                                season={v.season}
                                                episode={v.episode}
                                                srtUrl={v.srtUrl}
                                                vttUrl={v.vttUrl}
                                                source={v.source}
                                                playDirectUrl={v.playDirectUrl}
                                                liveVastUrl={v.liveVastUrl}
                                                type={type}
                                                menuData={menuData}
                                                subMenuData={seeMoreTitle}
                                                isSeries={v.isSeries}
                                                ppc_spotlight_active={v.ppc_spotlight_active}
                                                background_image_video={v.background_image_video}
                                                ppc_background_image={v.ppc_background_image}
                                                background_video_url={v.background_video_url}
                                                ppc_dark_overlay={v.ppc_dark_overlay}
                                                ppc_watch_now_url={v.ppc_watch_now_url}
                                                ppc_trailer_url={v.ppc_trailer_url}
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
        </div>
    );
};

export default SeeMoreDetailsPage;
