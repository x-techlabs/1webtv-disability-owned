import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getUserVideoProgress, getLocalStorageData } from '../../utils/localCache.util';

import Loading from './Loading';
import Player from './Player';
import { getMenuDetails, searchData } from '../../services/channelData.service';
import { useLocation } from 'react-router-dom';

const FeaturedPlayerWrapper = ({ activePage, activeSubPage = null }) => {
    const { videoTitle } = useParams();
    const [detailData, setDetailData] = useState(null);
    const [errorRedirect, setErrorRedirect] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [subPage, setSubPage] = useState("");
    const location = useLocation();
    const activeSubPageParentId = location.state?.activeSubPageParent;

    const playFromBeginning = location.state?.play_from_beginning;


    const handlePlayerClose = () => {
        const myProgress = getUserVideoProgress(detailData.id);
        const page_url = activePage ? activePage : localStorage.getItem('pageClick');
        if (myProgress > 0) {
            setCurrentProgress(Math.ceil(Number(myProgress)));
        } else {
            setCurrentProgress(0);
        }
        window.location.href = `/${page_url}/${subPage}/${encodeURIComponent(detailData.title)}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            const playlistId = getLocalStorageData('pageClick');
            try {
                const response = await searchData(videoTitle);
                let rawVideos = [];
                if (!response || !response.content || !(response.content.videos || response.content.movies || response.content.events)) {
                    rawVideos = response.content.series;
                } else {
                    rawVideos = response.content.videos || response.content.movies || response.content.events || [];
                }
                
                const menuData = await getMenuDetails(playlistId);
                const matchingPlaylist = menuData?.content?.playlists?.find(
                    (playlist) => String(playlist._id) === String(rawVideos[0].playlist_id)
                );
                const program_type = matchingPlaylist?.program_type ?? 'video';

                const formattedVideos = rawVideos.map((v) => ({
                    id: v._id,
                    playlist_id: v.playlist_id,
                    title: v.title,
                    description: v.description || '',
                    shortDescription: v.short_description || '',
                    hlsUrl: v.hls_url,
                    poster: v.poster,
                    posterH: v.poster_16_9,
                    posterV: v.poster_9_16,
                    startTime: v.start_date_time || '',
                    endTime: v.end_date_time || '',
                    duration: Number(v.duration || 0),
                    genres: v.genres || '',
                    category: v.category || '',
                    channelId: Number(v.channel_id),
                    director: v.director || '',
                    actor1: v.actor1 || '',
                    actor2: v.actor2 || '',
                    actor3: v.actor3 || '',
                    rating: v.rating || '',
                    ratingSource: v.rating_source || '',
                    releaseDate: v.releaseDate || '',
                    season: Number(v.season || 0),
                    episode: Number(v.episode || 0),
                    srtUrl: v.srt_url || '',
                    vttUrl: v.vtt_url || '',
                    source: v.source || '',
                    playDirectUrl: v.playDirectUrl || '',
                    liveVastUrl: v.liveVastUrl || '',
                    type: program_type,
                    monetization_type: v.monetizationDetails?.type || "Free",
                    monetization_price: v.monetizationDetails?.price || 0,
                    monetization_duration: v.monetizationDetails?.duration || '',
                    monetization_custom_duration: v.monetizationDetails?.custom_duration || '',
                    monetization_start_time: v.monetizationDetails?.start_time || '',
                    monetization_end_time: v.monetizationDetails?.end_time || '',
                }));
                setSubPage(formattedVideos[0].playlist_id)
                setDetailData(formattedVideos[0]);
                const myProgress = getUserVideoProgress(formattedVideos[0].id);
               if (playFromBeginning) {
                    setCurrentProgress(0);
                  } else {
                    setCurrentProgress(myProgress);
                  }
                //setCurrentProgress(myProgress);
            } catch (error) {
                console.error('Error fetching detail data:', error);
                setErrorRedirect(true);
            }
        };
        fetchData();
    }, [videoTitle]);

    if (!detailData) {
        return <Loading showVideo={false} />;
    }
    if (errorRedirect) return <Navigate to="/" replace />;
    
    return (
        <Player
            id="player"
            videoData={detailData}
            resumeFrom={currentProgress ? currentProgress : 0}
            handlePlayerClose={handlePlayerClose}
        />
    );
};

export default FeaturedPlayerWrapper;
