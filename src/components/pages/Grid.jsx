/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import DetailPage from './DetailPage';
import { getMenuVideoDetails, seriesData } from '../../services/channelData.service';
import { getAllVideoProgress } from '../../utils/localCache.util';
import scrollAppView from '../../utils/viewScroll.util';

const Grid = ({
  id,
  containerId,
  videosCount,
  type,
  activePage,
  activeSubPageParent,
  activeSubPage,
  videosList,
  keyUpElement,
  keyDownElement,
  menuData,
  subMenuData,
  title
}) => {
  const videoProgress = getAllVideoProgress();
  const scrollHandleButtonId = `scroll-${containerId}`;

  const [dataLoaded, setDataLoaded] = useState(false);
  const [videos, setVideos] = useState(videosList);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [detailPageData, setDetailPageData] = useState({});
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (activePage === '') {
      setDataLoaded(true);
      return;
    }
   
    getMenuVideoDetails(activePage, activeSubPage, page, perPage).then(
      (res) => {
        const response = res.content.videos;
       
        const videosData = [];

        response.forEach((v) => {
          videosData.push({
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
            rating: v.rating,
            ratingSource: v.rating_source || '',
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
          });
        });
        setVideos((data) => [...data, ...videosData]);
        setDataLoaded(true);
      }
    );
  }, [activeSubPage, page]);

  const handleShowDetailPage = (data) => {
    setShowDetailPage(false);
    setDetailPageData(data);
    setShowDetailPage(true);
  };
  const handleHideDetailPage = () => {
    setShowDetailPage(false);
  };

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

  if (!dataLoaded) {
    return <>&nbsp;</>;
  }
 
  return (
    <>
      <div className="grid-list" id={containerId}>
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
            {videos.filter(v => !!v.title).map((v, idx) => (
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
                  idx % 2 === 0
                    ? '.side-nav .prj-element.active'
                    : idx % 2 === 0
                    ? false
                    : `#item${id}gridv${videos[idx - 1].id}`
                }
                // dataFocusRight={
                //   idx % 2 === 0 ? `#item${id}gridv${videos[idx + 1].id}` : false
                // }
                dataFocusRight={
                  idx % 2 === 0 ? videos[idx + 1]
                      ? `#item${id}gridv${videos[idx + 1].id}`
                      : false
                      : false
                }
                
                dataFocusUp={
                  idx < 2
                    ? '.top-navigation .prj-element.active'
                    : `#item${id}gridv${videos[idx - 2].id}`
                }
                dataFocusDown={
                  idx > videos.length - 3
                    ? ''
                    : `#item${id}gridv${videos[idx + 2].id}`
                }
                dataOnSelfFocus={`#${scrollHandleButtonId}`}
                handleShowDetailPage={handleShowDetailPage}
                dataOnPagination={`${idx}-${containerId}`}
                activePage={activePage}
                activeSubPage={activeSubPage}
                activeSubPageParent={activeSubPageParent}
                gridView={true}
              />
            ))}
        </div>
      </div>

      {showDetailPage && (
        <DetailPage
          detailPageData={detailPageData}
          handleHideDetailPage={handleHideDetailPage}
          videos={videos}
          containerIdPrefix={`item${id}gridv`}
          setShowDetailPage={setShowDetailPage}
          activePage={activePage}
        />
      )}
    </>
  );
};

Grid.propTypes = {
  id: PropTypes.number.isRequired,
  containerId: PropTypes.string.isRequired,
  videosCount: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  activePage: PropTypes.string.isRequired,
  activeSubPage: PropTypes.string.isRequired,
  videosList: PropTypes.arrayOf(PropTypes.shape()),
  keyUpElement: PropTypes.string.isRequired,
  keyDownElement: PropTypes.string.isRequired,
};
Grid.defaultProps = {
  videosList: [],
};

export default Grid;
