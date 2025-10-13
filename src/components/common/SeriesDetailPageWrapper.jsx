import React, { useEffect, useState } from 'react'
import { getMenuDetails, seriesData, seriesEpisodeData } from '../../services/channelData.service';
import Loading from './Loading';
import SeriesDetailPage from '../pages/SeriesDetailPage';
import { getLocalStorageData } from '../../utils/localCache.util';
import { useNavigate } from 'react-router-dom';

const SeriesDetailPageWrapper = ({ activePage, menuData, activePageLayout, handlePageChange, landingPageButton }) => {
    const [seriesDetails, setSeriesDetails] = useState(null);
    const [videoData, setVideoData] = useState([]);
    const [activeSubPage, setActiveSubPage] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchData = async () => {
          const seriesTitleSlug = window.location.pathname.split('/')[4];
          try {
            const seriesId = getLocalStorageData('seriesId') || '';
            const series_id = seriesId.match(/item(\d+)/);
            let seriesPlaylistId = series_id ? series_id[1] : null;
            setActiveSubPage(seriesPlaylistId);
            const match = seriesId.match(/gridv(\d+)/);
            let gridvId = match ? match[1] : null;
            const menuData = await getMenuDetails(activePage);
            const matchingPlaylist = menuData?.content?.playlists?.find(
              (playlist) => String(playlist._id) === seriesPlaylistId
            );
            if (!matchingPlaylist  ) {
              navigate(`/`, { replace: true });
              return;
            }
            let all_seriesDetails = '';
            if (matchingPlaylist?.child_playlists?.length) {
              const gridPlaylistId = getLocalStorageData('gridPlaylistId');
              seriesPlaylistId = gridPlaylistId;
              all_seriesDetails = await seriesData(activePage, gridPlaylistId);
            } else {
              all_seriesDetails = await seriesData(activePage, matchingPlaylist?._id);
            }

            const matchedSeriesData = all_seriesDetails.content.series.find((series) => 
              series.title === decodeURIComponent(seriesTitleSlug)
            );
            if (! matchedSeriesData) {
              navigate(`/`, { replace: true });
              return;
            }

            const program_type = matchingPlaylist?.program_type ?? 'videos';
            if (gridvId === null) {
              const seriesDetails = await seriesData(activePage, matchingPlaylist._id);
              const matchedSeries = seriesDetails.content.series.find((series) => 
                series.title === decodeURIComponent(seriesTitleSlug)
              );
              const seriesId = matchedSeries.id;
              gridvId = seriesId;
            }

            const seriesDatas = await seriesEpisodeData(activePage, seriesPlaylistId, gridvId);
            const seriesDetails = seriesDatas.content.series;
            const formattedSeries = seriesDetails.map((s) => ({
              id: s._id,
              title: s.title,
              long_description: s.long_description || '',
              short_description: s.short_description || '',
              posterH: s.poster_16_9,
              posterV: s.poster_9_16,
              release_date: s.release_date,
              episodes: s.episodes,
              type: program_type,
              isPortrait: program_type === 'video' ? false : true,
            }));
           
            if (formattedSeries.length === 0) {
              navigate(`/`, { replace: true });
              return;
            }
            setSeriesDetails(formattedSeries[0]);
            setVideoData(formattedSeries[0]?.episode);
          } catch (error) {
            navigate(`/`, { replace: true });
            // console.error('Error fetching detail data:', error);
          }
      };
  
      fetchData();
    }, [activePage, navigate]);
  
    if (!seriesDetails) {
      return <Loading showVideo={false} />;
    }
  
    return (
      <SeriesDetailPage
        key={seriesDetails.id || seriesDetails._id}
        detailPageData={seriesDetails}
        videos={videoData}
        containerIdPrefix={`item${seriesDetails.id || seriesDetails._id}`}
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

export default SeriesDetailPageWrapper
