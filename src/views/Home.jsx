import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PAGE_LAYOUT } from '../config/const.config';
import MainLayout from '../layout/Main';
import Loading from '../components/common/Loading';
import SideMenu from '../components/common/SideMenu';
import HorizontalList from '../components/pages/HorizontalList';
import LiveStreamComponent from '../components/pages/LiveStreamComponent';
import Grid from '../components/pages/Grid';
// import BgPlayer from '../components/common/BgPlayer';
import { getMenuDetails } from '../services/channelData.service';
import LandingPageData from '../static/landingPage';
import { useNavigate } from 'react-router-dom';
import SeriesHorizontalList from '../components/pages/SeriesHorizontalList';
import { addLocalStorageData } from '../utils/localCache.util';

const Home = ({ menuData, activePage, activePageLayout, handlePageChange }) => {
  const [subMenuData, setSubMenuData] = useState([]);
  const [videosData, setVideosData] = useState({});
  const [activeSubPage, setActiveSubPage] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [subPageLoaded, setSubPageLoaded] = useState(false);
  const navigate = useNavigate();
  const showVideo = activePageLayout.bgVideo && activePageLayout.layout === PAGE_LAYOUT.RAIL;
  const isAnyLiveEvent = subMenuData.some((smd) => smd.is_live_events === 1);
  const [hasChildGrid, setHasChildGrid] = useState(false);

  useEffect(() => {
    setPageLoaded(false);
    const playlistTitle = window.location.pathname.split('/')[1];
    const playlistId = menuData.find((m) => m.title === decodeURIComponent(playlistTitle))?.id;
    if (!playlistId) {
      navigate(`/`, { replace: true });
      return;
    }
    addLocalStorageData('pageClick', playlistId);

    const activePageId = playlistId ? playlistId : activePage;
    getMenuDetails(activePageId)
      .then(async (res) => {
        const menu = [];
        const menuPlaylists = {};

        res.content.playlists.forEach((m) => {
          if (m.child_playlists) {
            menu.push({
              id: m._id,
              title: m.title,
              is_live_events: (m.program_type === 'event') ? 1 : 0
             
            });

            menuPlaylists[m._id] = {
              hasChildPlaylist: true,
              childPlaylists: [],
            };

            m.child_playlists.forEach((cp) => {
              menuPlaylists[m._id].childPlaylists.push({
                id: cp._id,
                title: cp.title,
                videosCount: Number(cp.videos_count),
                seriesCount: Number(cp.series_count),
                type: cp.program_type,
              });
            });
          } else {
            menu.push({
              id: m._id,
              title: m.title,
              is_live_events: (m.program_type === 'event') ? 1 : 0,
              playlist_along_live_events: m.playlist_along_live_events,
            });

            if (m.playlist_along_live_events === 0) {
              menuPlaylists[m._id] = {
                hasChildPlaylist: false,
                videosCount: Number(m.videos_count),
                seriesCount: Number(m.series_count),
                type: m.videos_count > 0 ? m.program_type : "video",
              };
            }
          }
        });

        setSubMenuData(menu);
        setVideosData(menuPlaylists);

        setActiveSubPage(menu[0].id.toString());
        setPageLoaded(true);
        setSubPageLoaded(true);
      })
      .catch(() => {});
  }, [menuData, activePage]);

  const handleSubPageChange = (page) => {
    setSubPageLoaded(false);
    setActiveSubPage(page.toString());
    setTimeout(() => setSubPageLoaded(true), 250);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    const subPageData = videosData[Number(activeSubPage)];
    if (activePageLayout.layout === PAGE_LAYOUT.RAIL) {
      if (subPageData?.hasChildPlaylist && subPageData.childPlaylists?.length > 0) {
        setHasChildGrid(true);
      } else if (!subPageData?.childPlaylists?.length) {
        setHasChildGrid(true);
      }else {
        setHasChildGrid(false);
      }
    } else if (activePageLayout.layout === PAGE_LAYOUT.GRID) {
      if (subPageData?.hasChildPlaylist && subPageData.childPlaylists?.length > 0) {
        setHasChildGrid(false);
      } else {
        setHasChildGrid(false);
      }
    }
  }, [activeSubPage, videosData, activePageLayout]);

  return (
    <>
      <MainLayout
        menuData={menuData}
        activePage={activePage}
        handlePageChange={handlePageChange}
        activePageLayoutType={activePageLayout.layout}
        copyRightText={LandingPageData.copyRight}
        isAnyLiveEvent={isAnyLiveEvent}
      >
        <div
          className={
            showVideo
              ? 'page-container has-show-bg-video'
              : 'page-container main-no-video-show'
          }
          id="page-container-main"
        >
          {!pageLoaded && <Loading showVideo={Boolean(showVideo)} />}
          {pageLoaded && (
            <>
              {activePageLayout.layout === PAGE_LAYOUT.GRID && (
                <>
                  <div className="side-menu">
                    <SideMenu
                      subMenuData={subMenuData}
                      activeSubPage={activeSubPage}
                      handleSubPageChange={handleSubPageChange}
                    />
                  </div>

                  {!subPageLoaded && <Loading />}

                  {subPageLoaded && (
                    <div className="page-content horizontal-list" id="page-content">
                      {videosData[Number(activeSubPage)].videosCount > 0 ? (
                        <>
                          {!videosData[Number(activeSubPage)].hasChildPlaylist && (
                            <Grid
                              id={Number(activeSubPage)}
                              containerId={`grid-${activeSubPage}`}
                              videosCount={
                                videosData[Number(activeSubPage)].videosCount
                              }
                              type={videosData[Number(activeSubPage)].type}
                              activePage={activePage}
                              activeSubPageParent={null}
                              activeSubPage={activeSubPage}
                              keyUpElement=".top-navigation .prj-element.active"
                              keyDownElement={`grid-${Number(activeSubPage) + 1}`}
                              menuData={menuData}
                              subMenuData={subMenuData}
                              onMovieClick={handleMovieClick}
                              title={null}
                            />
                          )}
                          {videosData[Number(activeSubPage)].hasChildPlaylist && (
                            <>
                              {videosData[Number(activeSubPage)].childPlaylists.map(
                                (cpd, idx) => (
                                  <HorizontalList
                                    id={cpd.id}
                                    title={cpd.title}
                                    containerId={`hl-${cpd.id}`}
                                    videosCount={videosData[cpd.id].videosCount}
                                    type={videosData[cpd.id].type}
                                    activePage={activePage}
                                    activeSubPageParent={activeSubPage}
                                    activeSubPage={`${cpd.id}`}
                                    key={`hl${cpd.id}`}
                                    menuData={menuData}
                                    subMenuData={subMenuData}
                                    keyUpElement={
                                      idx === 0
                                        ? '.top-navigation .prj-element.active'
                                        : `#hl-${videosData[Number(activeSubPage)]
                                          .childPlaylists[idx - 1].id
                                        } .prj-element`
                                    }
                                    keyDownElement={
                                      idx + 1 ===
                                        videosData[Number(activeSubPage)]
                                          .childPlaylists.length
                                        ? ''
                                        : `#hl-${videosData[Number(activeSubPage)]
                                          .childPlaylists[idx + 1].id
                                        } .prj-element`
                                    }
                                  />
                                )
                              )}
                            </>
                          )}
                        </>
                      ) : videosData[Number(activeSubPage)]?.hasChildPlaylist &&
                        videosData[Number(activeSubPage)]?.childPlaylists?.length > 0 ? (
                        <>
                          {videosData[Number(activeSubPage)].childPlaylists.map((pd, idx) => (
                             <Grid
                              id={Number(activeSubPage)}
                              containerId={`grid-${activeSubPage}`}
                              videosCount={pd.videosCount}
                             // type={videosData[Number(activeSubPage)].type}
                              type={pd.type}
                              activePage={activePage}
                              activeSubPageParent={activeSubPage}
                              activeSubPage={pd?.id}
                              keyUpElement=".top-navigation .prj-element.active"
                              keyDownElement={`grid-${Number(activeSubPage) + 1}`}
                              menuData={menuData}
                              subMenuData={subMenuData}
                              onMovieClick={handleMovieClick}
                              title={pd.title}
                            /> 
                          ))}
                        </>
                      ) : (
                        <div className="video_not_found">
                          <h5 className='m-0'>No Videos Available</h5>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {activePageLayout.layout === PAGE_LAYOUT.RAIL && (
                <div
                  className={`page-content ${showVideo ? 'has-bg-video' : ''}`}
                  id="page-content"
                >
                  {videosData[Number(activeSubPage)].videosCount > 0 ? (
                    <>
                      
                      {subMenuData.map((smd, idx) => {
                        const keyUpElement =
                          idx === 0
                            ? '.top-navigation .prj-element.active'
                            : `#hl-${subMenuData[idx - 1].id} .prj-element`;

                        const keyDownElement =
                          idx + 1 === subMenuData.length
                            ? ''
                            : `#hl-${subMenuData[idx + 1].id} .prj-element`;

                        if (smd.is_live_events === 1) {
                          return (
                            <LiveStreamComponent
                              id={smd.id}
                              title={smd.title}
                              key={`live-${smd.id}`}
                              activePage={activePage}
                              activeSubPage={`${smd.id}`}
                              activeSubPageParent={null}
                              type={videosData[smd.id]?.type ?? ''}
                              menuData={menuData}
                              subMenuData={subMenuData}
                            />
                          );
                        } else {
                          return (
                            <HorizontalList
                              id={smd.id}
                              title={smd.title}
                              containerId={`hl-${smd.id}`}
                              videosCount={videosData[smd.id]?.videosCount ?? 0}
                              type={videosData[smd.id]?.type ?? ''}
                              activePage={activePage}
                              activeSubPageParent={null}
                              activeSubPage={`${smd.id}`}
                              seriesCount={videosData[smd.id]?.seriesCount ?? 0}
                              menuData={menuData}
                              subMenuData={subMenuData}
                              key={`hl${smd.id}`}
                              keyUpElement={keyUpElement}
                              keyDownElement={keyDownElement}
                            />
                          );
                        }
                      })}

                      &nbsp;
                    </>
                    ) : videosData[Number(activeSubPage)]?.seriesCount > 0 ? (
                      <>
                        {/* seriesCount branch */}
                        {subMenuData.map((smd, idx) => (
                          <SeriesHorizontalList
                            id={smd.id}
                            title={smd.title}
                            containerId={`hl-${smd.id}`}
                          videosCount={videosData[smd.id].videosCount}
                          seriesCount={videosData[smd.id].seriesCount}
                          type={videosData[smd.id].type}
                            activePage={activePage}
                            activeSubPage={`${smd.id}`}
                            menuData={menuData}
                            subMenuData={subMenuData}
                            key={`hl${smd.id}`}
                            keyUpElement={
                              idx === 0
                                ? '.top-navigation .prj-element.active'
                                : `#hl-${subMenuData[idx - 1].id} .prj-element`
                            }
                            keyDownElement={
                              idx + 1 === subMenuData.length
                                ? ''
                                : `#hl-${subMenuData[idx + 1].id} .prj-element`
                            }
                          />
                        ))}
                      </>
                    ) :  videosData[Number(activeSubPage)]?.hasChildPlaylist &&
                         videosData[Number(activeSubPage)]?.childPlaylists?.length > 0 ?(
                      <>
                        {/* hasChildPlaylist branch */}
                        {videosData[Number(activeSubPage)]?.childPlaylists?.map((smd, idx,arr) => (
                            <HorizontalList
                              id={smd.id}
                              title={smd.title}
                              containerId={`hl-${smd.id}`}
                              videosCount={smd?.videosCount ?? 0}
                              type={smd.type}
                              activePage={activePage}
                              activeSubPageParent={activeSubPage}
                              activeSubPage={`${smd?.id}`}
                              seriesCount={videosData[smd.id]?.seriesCount ?? 0}
                              menuData={menuData}
                              subMenuData={subMenuData}
                              key={`hl${smd.id}`}
                              keyUpElement={
                                idx === 0
                                  ? '.top-navigation .prj-element.active'
                                  : `#hl-${arr[idx - 1]?.id} .prj-element`
                              }
                              keyDownElement={
                                idx + 1 === arr.length
                                  ? ''
                                  : `#hl-${arr[idx + 1]?.id} .prj-element`
                              }
                            />
                        ))}
                      </>
                    ) : (
                      <div className="video_not_found">
                        <h5 className='m-0'>No Videos Available</h5>
                      </div>
                    )}

                  {videosData[Number(activeSubPage)].videosCount === 0 && videosData[Number(activeSubPage)].seriesCount === 0 && (
                    <div className='iframe'>
                      <iframe 
                        src={process.env.REACT_APP_IFRAME_URL}
                        frameBorderfree="0" 
                        width="100%" 
                        height="800" 
                        allowFullScreen
                        title="Rayd8 Home Page"
                      ></iframe>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </MainLayout>
    </>
  );
};

Home.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  activePageLayout: PropTypes.shape({
    // layout: PropTypes.string,
    // bgVideo: PropTypes.string,
  }),
  handlePageChange: PropTypes.func.isRequired,
};

export default Home;
