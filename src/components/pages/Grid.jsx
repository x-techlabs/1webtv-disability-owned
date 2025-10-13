/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import { getMenuVideoDetails, seriesPaginationData } from '../../services/channelData.service';
import { getAllVideoProgress } from '../../utils/localCache.util';
import scrollAppView from '../../utils/viewScroll.util';
import { useLocation } from 'react-router-dom';

const Grid = ({
  id,
  title,
  containerId,
  videosCount,
  type,
  activePage,
  activeSubPageParent,
  activeSubPage,
  videosList = [],
  // keyUpElement,
  // keyDownElement,
  seriesCount,
  menuData,
  subMenuData,
  gridPlaylistId,
}) => {
  const videos = videosList;
  const location = useLocation();
  const videoProgress = getAllVideoProgress();
  const scrollHandleButtonId = `scroll-${containerId}`;

  const [dataLoaded, setDataLoaded] = useState(false);
  const [mediaItems, setMediaItems] = useState(videosList);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (activePage === '') {
      setDataLoaded(true);
      return;
    }

    if (location.pathname !== "/search") {
      const videoPromise = videosCount > 0
        ? getMenuVideoDetails(activePage, activeSubPage, page, perPage)
        : Promise.resolve({ content: { videos: [] } });
    
      const seriesPromise = seriesCount > 0
        ? seriesPaginationData(activePage, activeSubPage, page, perPage)
        : Promise.resolve({ content: { series: [] } });
  
      Promise.all([videoPromise, seriesPromise]).then(([videoRes, seriesRes]) => {
        const videos = videoRes.content.videos.map((v) => ({
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
          season: Number(v.season),
          episode: Number(v.episode),
          srtUrl: v.srt_url || '',
          vttUrl: v.vtt_url || '',
          source: v.source || '',
          playDirectUrl: v.playDirectUrl || '',
          liveVastUrl: v.liveVastUrl || '',
          type,
          isSeries: false,
          monetization_type:v.monetizationDetails?.type || "Free",
          monetization_price:v.monetizationDetails?.price || 0,
          monetization_duration:v.monetizationDetails?.duration || '',
          monetization_custom_duration:v.monetizationDetails?.custom_duration || '',
          monetization_start_time:v.monetizationDetails?.start_time || '',
          monetization_end_time:v.monetizationDetails?.end_time || '',
        }));
  
        const series = seriesRes.content.series.map((s) => ({
          id: s.id,
          title: s.title,
          shortDescription: s.short_description || '',
          long_description: s.long_description || '',
          posterH: s.poster_16_9_small,
          posterV: s.poster_9_16,
          release_date: s.release_date || '',
          episode_count: s.episode_count || '',
          isSeries: true,
        }));
  
        setMediaItems((prev) => {
          const combined = [...prev, ...videos, ...series];
          const uniqueById = new Map();
          combined.forEach(item => uniqueById.set(item.id, item));
          return Array.from(uniqueById.values());
        });
        setDataLoaded(true);
      });
    } else {
      setDataLoaded(true);
      setMediaItems(videosList);
    }
  }, [activePage, activeSubPage, seriesCount, type, videosCount]);

  const handleScroll = () => {
    const focusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );
    if (focusedElements.length > 0) {
      scrollAppView(focusedElements[0]);
      const currentFocus =
        focusedElements[0].dataset.focusPagination.split('-')[0];
      if (Number(currentFocus) === videos.length - 1) {
        setPage(page + 1);
      }
    }
  };

    const handleShowDetailPage = (data) => {
    if (window.document.getElementById('resume-btn')) {
      window.document.getElementById('resume-btn').classList.add('focused');
    } else if (window.document.getElementById('play-btn')) {
      window.document.getElementById('play-btn').classList.add('focused');
    }
  };

  if (!dataLoaded) {
    return <>&nbsp;</>;
  }

  return (
    <>
    {mediaItems.length > 0 && (
      <div className={`grid-list ${type}`} id={containerId}>
        <button
          type="button"
          className="hide"
          id={scrollHandleButtonId}
          onClick={handleScroll}
        >
          Scroll
        </button>
        {title && <div className="grid-title">{title}</div>}
        <div className='row row-gap-3'>
            {mediaItems.filter(v => !!v.title).map((v, idx) => (
              <Item
                key={`${id}gridv${v.id}`}
                id={`item${id}gridv${v.id}`}
                videoId={v.id}
                playlist_id={v.playlist_id}
                title={v.title}
                description={v.description}
                shortDescription={v.shortDescription}
                hlsUrl={v.hlsUrl}
                poster={v.poster}
                posterH={v.posterH}
                posterV={v.posterV}
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
                season={v.season}
                episode={v.episode}
                srtUrl={v.srtUrl}
                vttUrl={v.vttUrl}
                source={v.source}
                playDirectUrl={v.playDirectUrl}
                liveVastUrl={v.liveVastUrl}
                type={type}
                menuData={menuData}
                isSeries={v.isSeries}
                subMenuData={subMenuData}
                monetization_type={v.monetization_type || ''}
                monetization_price={v.monetization_price || ''}
                monetization_duration={v.monetization_duration || ''}
                monetization_custom_duration={v.monetization_custom_duration || ''}
                monetization_start_time={v.monetization_start_time || ''}
                monetization_end_time={v.monetization_end_time || ''}
                dataFocusLeft={
                  idx === 0
                    ? '.side-nav .prj-element.active'
                    : `#item${id}v${mediaItems[idx - 1].id}`
                }
                dataFocusRight={
                  idx + 1 === mediaItems.length
                    ? ''
                    : `#item${id}v${mediaItems[idx + 1].id}`
                }
                dataFocusUp={
                  idx < 2
                    ? '.top-navigation .prj-element.active'
                    : `#item${id}gridv${mediaItems[idx - 2].id}`
                }
                dataFocusDown={
                  idx > mediaItems.length - 3
                    ? ''
                    : `#item${id}gridv${mediaItems[idx + 2].id}`
                }
                dataOnSelfFocus={`#${scrollHandleButtonId}`}
                handleShowDetailPage={handleShowDetailPage}
                dataOnPagination={`${idx}-${containerId}`}
                activePage={activePage}
                activeSubPage={activeSubPage}
                activeSubPageParent={activeSubPageParent}
                gridView={true}
                gridPlaylistId={gridPlaylistId}
              />
            ))}
        </div>
      </div>
      )}
    </>
  );
};

Grid.propTypes = {
  id: PropTypes.number.isRequired,
  containerId: PropTypes.string.isRequired,
  videosCount: PropTypes.number,
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

export default Grid;