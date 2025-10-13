/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VIDEO_TYPES } from '../config/const.config';
import MainLayout from '../layout/Main';
import HorizontalList from '../components/pages/HorizontalList';
import Loading from '../components/common/Loading';
import { getMenuDetails, searchData } from '../services/channelData.service';
import LandingPageData from '../static/landingPage';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/16/solid';
import SeriesHorizontalList from "../components/pages/SeriesHorizontalList"

const Search = ({ menuData, activePage, handlePageChange }) => {
  const location = useLocation();
  const [searching, setSearching] = useState(false);
  const livePlaylistIdRef = useRef(null);
  const [subMenuData, setSubMenuData] = useState();
  const [data, setData] = useState({
    videos: [],
    movies: [],
    events: [],
    series: [],
    success: true,
    noData: false,
  });

  const updateSearchData = async (val) => {
    setSearching(true);

    if (val === '') {
      setSearching(false);
      setData({
        videos: [],
        movies: [],
        events: [],
        series: [],
        success: true,
        noData: false,
      });
      return;
    }

    try {
      const menuData = await getMenuDetails(activePage);
      const playlists = menuData.content?.playlists || [];
      const eventItem = playlists.find(item => item.program_type === "event");
  
      if (eventItem) {
        livePlaylistIdRef.current = eventItem._id;
      }

      const res = await searchData(val);
        const { content } = res;
        const finalData = {
          videos: [],
          movies: [],
          events: [],
          series: [],
        };

        (content.videos || []).forEach((v) => {
          const matchedPlaylist = playlists.find(p => p._id === v.playlist_id);
          // const fallbackTitle = playlists?.[0]?.title;
          //const title = matchedPlaylist?.title || fallbackTitle;
          const title = v?.title || matchedPlaylist?.title;
          setSubMenuData(encodeURIComponent(title));
          finalData.videos.push({
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
            type: VIDEO_TYPES.VIDEO,
            monetization_type:v.monetizationDetails?.type || "Free",
            monetization_price:v.monetizationDetails?.price || 0,
            monetization_duration:v.monetizationDetails?.duration || '',
            monetization_custom_duration:v.monetizationDetails?.custom_duration || '',
            monetization_start_time:v.monetizationDetails?.start_time || '',
            monetization_end_time:v.monetizationDetails?.end_time || '',
            isSeries: false,
          });
        });
        (content.movies || []).forEach((v) => {
          const matchedPlaylist = playlists.find(p => p._id === v.playlist_id);
          const title = v?.title || matchedPlaylist?.title;
          setSubMenuData(encodeURIComponent(title));
          finalData.movies.push({
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
            type: VIDEO_TYPES.MOVIES,
            monetization_type:v.monetizationDetails?.type || "Free",
            monetization_price:v.monetizationDetails?.price || 0,
            monetization_duration:v.monetizationDetails?.duration || '',
            monetization_custom_duration:v.monetizationDetails?.custom_duration || '',
            monetization_start_time:v.monetizationDetails?.start_time || '',
            monetization_end_time:v.monetizationDetails?.end_time || '',
            isSeries: false,
          });
        });
        (content.events || []).forEach((v) => {
          const matchedEventPlaylist = playlists.find(p => p._id === livePlaylistIdRef.current);
          const title = v?.title || matchedEventPlaylist?.title;
          setSubMenuData(encodeURIComponent(title));
          finalData.events.push({
            id: v._id,
            playlist_id: livePlaylistIdRef.current,
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
            type: VIDEO_TYPES.EVENT,
            monetization_type:v.monetizationDetails?.type || "Free",
            monetization_price:v.monetizationDetails?.price || 0,
            monetization_duration:v.monetizationDetails?.duration || '',
            monetization_custom_duration:v.monetizationDetails?.custom_duration || '',
            monetization_start_time:v.monetizationDetails?.start_time || '',
            monetization_end_time:v.monetizationDetails?.end_time || '',
            isSeries: false,
          });
        });
        (content.series || []).forEach((s) => {
          const matchedPlaylist = playlists.find(p => p._id === s.playlist_id);
          const title = s?.title || matchedPlaylist?.title;
          setSubMenuData(encodeURIComponent(title) ?? 'series');
          finalData.series.push({
            id: s.id,
            title: s.title,
            shortDescription: s.short_description || '',
            long_description: s.long_description || '',
            posterH: s.poster_16_9_small,
            posterV: s.poster_9_16,
            release_date: s.release_date || '',
            episode_count: s.episode_count || '',
            playlist_id: s.playlist_id || '',
            isSeries: true,
          });
        });

        setData({
          ...finalData,
          success: true,
          noData:
            finalData.videos.length === 0 &&
            finalData.movies.length === 0 &&
            finalData.events.length === 0 &&
            finalData.series.length === 0,
        });
        setSearching(false);
      } catch (err) {
        setSearching(false);
        setData({
          videos: [],
          movies: [],
          events: [],
          series: [],
          success: false,
          noData: true,
        });
        return;
      } finally {
        setSearching(false);
      };
  };

  const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(name);
  };

  const videoTitle = getQueryParam('search');
  useEffect(() => {
    updateSearchData(videoTitle);
  }, [videoTitle])

  const clickOnBackButton = () => {
    sessionStorage.removeItem('initialUrl');
    const lastPage = sessionStorage.getItem("lastPage") || "/"; 
    window.location.href = lastPage;
  };

  return (
    <MainLayout
      menuData={menuData}
      activePage={activePage}
      handlePageChange={handlePageChange}
      copyRightText={LandingPageData.copyRight}
    >
      <div className='search-page-details'>
      <div className="back-to-page prj-element search-page-back-button" id="back-to-page" onClick={clickOnBackButton}>
        <ArrowLeftIcon className=""/>
      </div>
      <div className="page-container search-page">
        <div className="page-content" id="page-content">
          <div className="search-results prj-element" id="search-res">
            {searching && (
              <div className="loading">
                <Loading />
              </div>
            )}

            {data.noData && !searching && (
              <div className="searching">No data found</div>
            )}

            {data.videos.length > 0 && (
              <HorizontalList
                id={1}
                title="Videos"
                containerId="hl-1"
                videosCount={data.videos.length}
                type={VIDEO_TYPES.VIDEO}
                activePage={activePage}
                activeSubPageParent={null}
                activeSubPage={data.videos[0].playlist_id}
                videosList={data.videos}
                menuData={menuData}
                subMenuData={subMenuData}
                isSeries={false}
                keyUpElement="#query"
                keyDownElement=".media-element.portrait.prj-element"
              />
            )}

            {data.movies.length > 0 && (
              <HorizontalList
                id={2}
                title="Movies"
                containerId="hl-2"
                videosCount={data.movies.length}
                type={VIDEO_TYPES.MOVIES}
                activePage={activePage}
                activeSubPageParent={null}
                activeSubPage={data.movies[0].playlist_id}
                isSeries={false}
                videosList={data.movies}
                menuData={menuData}
                subMenuData={subMenuData}
                keyUpElement=".media-element.prj-element"
                keyDownElement=".media-element.prj-element"
              />
            )}

            {data.events.length > 0 && (
              <HorizontalList
                id={3}
                title="Events"
                containerId="hl-3"
                videosCount={data.events.length}
                type={VIDEO_TYPES.EVENT}
                activePage={activePage}
                activeSubPageParent={null}
                activeSubPage={data.events[0].playlist_id}
                menuData={menuData}
                subMenuData={subMenuData}
                isSeries={false}
                videosList={data.events}
                keyUpElement=".top-navigation .prj-element.active"
                keyDownElement=".media-element.prj-element"
              />
            )}

            {data.series.length > 0 && (
              <SeriesHorizontalList
                id={4}
                title="Series"
                containerId="hl-2"
                videosCount={data.series.length}
                type="videos"
                activePage={activePage}
                activeSubPage={data.series[0].playlist_id}
                videosList={data.series}
                menuData={menuData}
                subMenuData={subMenuData}
                isSeries={false}
                keyUpElement=".media-element.prj-element"
                keyDownElement=".media-element.prj-element"
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

Search.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default Search;
