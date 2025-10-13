import React, { useEffect, useState } from 'react'
import { addLocalStorageData } from '../../utils/localCache.util';
import { getMenuDetails, searchData } from '../../services/channelData.service';
import Loading from './Loading';
import DetailPage from '../pages/DetailPage';
import { useNavigate } from 'react-router-dom';

const DetailPageWrapper = ({ activePage, menuData, activePageLayout, handlePageChange, landingPageButton }) => {
    const [detailData, setDetailData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [activeSubPage, setActiveSubPage] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchData = async () => {
          const activeMenuTitle = window.location.pathname.split('/')[1];
          const matchingActiveMenu = menuData.find(
            (menu) => String(encodeURIComponent(menu.title)) === activeMenuTitle
          );
          const playlistCategoryTitle = window.location.pathname.split('/')[2];
          const videoTitleSlug = window.location.pathname.split('/')[3];
          setActiveSubPage(playlistCategoryTitle);
          addLocalStorageData('pageClick', activePage);
          try {
            const menuData = await getMenuDetails(activePage);
            const decodedUrlTitle = decodeURIComponent(playlistCategoryTitle);
            const matchingPlaylist = menuData?.content?.playlists?.find(
              (playlist) => playlist.title === decodedUrlTitle
            );
            if (!matchingActiveMenu) {
              navigate(`/`, { replace: true });
              return;
            }
            const program_type = matchingPlaylist?.program_type ?? 'video';
            const response = await searchData(videoTitleSlug, 'video');
            const rawVideos = response.content.videos || response.content.movies || response.content.events || [];
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
              monetization_type:v.monetizationDetails?.type || "Free",
              monetization_price:v.monetizationDetails?.price || 0,
              monetization_duration:v.monetizationDetails?.duration || '',
              monetization_custom_duration:v.monetizationDetails?.custom_duration || '',
              monetization_start_time:v.monetizationDetails?.start_time || '',
              monetization_end_time:v.monetizationDetails?.end_time || '',
              isPortrait: program_type === 'movies' ? true : false,
            }));
            if (formattedVideos.length === 0) {
              navigate(`/`, { replace: true });
              return;
            }
            setDetailData(formattedVideos[0]);
            setVideos(formattedVideos);
          } catch (error) {
            navigate(`/`, { replace: true });
            // console.error('Error fetching detail data:', error);
          }
      };
  
      fetchData();
    }, [activePage, menuData, navigate]);
    
    if (!detailData) {
      return <Loading showVideo={false} />;
    }
  
    return (
      <DetailPage
        key={detailData.id || detailData._id}
        detailPageData={detailData}
        videos={videos}
        containerIdPrefix={`item${detailData.id || detailData._id}`}
        activePage={activePage}
        activeSubPage={activeSubPage}
        handleHideDetailPage={() => {}}
        setShowDetailPage={() => {}}
        menuData={menuData}
        activePageLayout={activePageLayout}
        handlePageChange={handlePageChange}
        landingPageButton={menuData[0].id}
      />
    );
};

export default DetailPageWrapper
