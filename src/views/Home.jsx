import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PAGE_LAYOUT } from '../config/const.config';
import MainLayout from '../layout/Main';
import Loading from '../components/common/Loading';
import SideMenu from '../components/common/SideMenu';
import HorizontalList from '../components/pages/HorizontalList';
import Grid from '../components/pages/Grid';
import { getMenuDetails } from '../services/channelData.service';
import LandingPageData from '../static/landingPage';
import { useNavigate } from 'react-router-dom';
import SeriesHorizontalList from '../components/pages/SeriesHorizontalList';
import { addLocalStorageData } from '../utils/localCache.util';
import LiveStreamComponent from '../components/pages/LiveStreamComponent';
import GridHorizontalList from '../components/pages/GridHorizontalList';

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
    const playlistTitle = window.location.pathname === "/" ? encodeURIComponent(menuData[0].title) : window.location.pathname.split('/')[1];
    const playlistId = menuData.find((m) => m.title === decodeURIComponent(playlistTitle))?.id;
    if (!playlistId && decodeURIComponent(playlistTitle) !== "Live TV") {
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
              videosCount: Number(m.videos_count),
              seriesCount: Number(m.series_count),
              is_live_events: (m.program_type === 'event') ? 1 : 0
            });

            if (m.playlist_along_live_events === 0) {
              menuPlaylists[m._id] = {
                hasChildPlaylist: false,
                videosCount: Number(m.videos_count),
                seriesCount: Number(m.series_count),
                type: (m.videos_count || m.series_count) > 0 ? m.program_type : "video",
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
      .catch(() => {
        setPageLoaded(true);
        setSubPageLoaded(true);
      });
  }, [menuData, activePage, navigate]);

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
      } else {
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
            `${showVideo
              ? 'page-container has-show-bg-video'
              : 'page-container main-no-video-show'
            }${hasChildGrid ? ' inner-page-grid' : ''}`
          }
          id="page-container-main"
        >
          {!pageLoaded && <Loading showVideo={Boolean(showVideo)} />}
          <>
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
                        {(() => {
                          const subPageData = videosData[Number(activeSubPage)];
                          if (!subPageData) {
                            return (
                              <div className="video_not_found">
                                <h5 className="m-0">No Videos Available</h5>
                              </div>
                            );
                          }

                          const { videosCount, seriesCount, hasChildPlaylist, childPlaylists, type } = subPageData;

                          // ✅ Helper: Render Grid
                          const renderGrid = (props = {}) => (
                            <Grid
                              id={Number(activeSubPage)}
                              containerId={`grid-${activeSubPage}`}
                              type={subPageData.type}
                              activePage={activePage}
                              activeSubPage={activeSubPage}
                              keyUpElement=".top-navigation .prj-element.active"
                              keyDownElement={`grid-${Number(activeSubPage) + 1}`}
                              menuData={menuData}
                              subMenuData={subMenuData}
                              onMovieClick={handleMovieClick}
                              activeSubPageParent={activeSubPage}
                              {...props}
                            />
                          );

                          // ✅ Helper: Render Horizontal Lists
                          const renderHorizontalLists = () =>
                            childPlaylists.map((cpd, idx) => (
                              <HorizontalList
                                key={`hl${cpd.id}`}
                                id={cpd.id}
                                title={cpd.title}
                                containerId={`hl-${cpd.id}`}
                                videosCount={videosData[cpd.id].videosCount}
                                type={videosData[cpd.id].type}
                                activePage={activePage}
                                activeSubPageParent={activeSubPage}
                                activeSubPage={`${cpd.id}`}
                                menuData={menuData}
                                subMenuData={subMenuData}
                                keyUpElement={
                                  idx === 0
                                    ? ".top-navigation .prj-element.active"
                                    : `#hl-${childPlaylists[idx - 1].id} .prj-element`
                                }
                                keyDownElement={
                                  idx + 1 === childPlaylists.length
                                    ? ""
                                    : `#hl-${childPlaylists[idx + 1].id} .prj-element`
                                }
                              />
                            ));

                          // ✅ Main decision logic
                          if (videosCount > 0) {
                            return hasChildPlaylist ? renderHorizontalLists() : renderGrid({ videosCount, type });
                          }

                          if (seriesCount > 0) {
                            return hasChildPlaylist ? renderHorizontalLists() : renderGrid({ seriesCount, type });
                          }

                          if (hasChildPlaylist && childPlaylists?.length > 0) {
                            return childPlaylists.map((pd, idx) =>
                              renderGrid({
                                key: pd.id,
                                videosCount: pd.videosCount,
                                seriesCount: pd.seriesCount,
                                activeSubPageParent: activeSubPage,
                                activeSubPage: pd.id,
                                title: pd.title,
                                gridPlaylistId: pd.id,
                                type: pd.type,
                              })
                            );
                          }

                          return (
                            <div className="video_not_found">
                              <h5 className="m-0">No Videos Available</h5>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}

                {activePageLayout.layout === PAGE_LAYOUT.RAIL && (() => {
                  const subPageData = videosData[Number(activeSubPage)];
                  if (!subPageData) {
                    return (
                      <div className="video_not_found">
                        <h5 className="m-0">No Videos Available</h5>
                      </div>
                    );
                  }

                  const showSidebar = Object.values(videosData).some((vd) => vd?.hasChildPlaylist);

                  // ✅ Helper: Render Grid
                  const renderGrid = (props = {}) => (
                    <GridHorizontalList
                      id={Number(activeSubPage)}
                      containerId={`grid-${activeSubPage}`}
                      type={subPageData?.type || ""}
                      activePage={activePage}
                      activeSubPage={activeSubPage}
                      keyUpElement=".top-navigation .prj-element.active"
                      keyDownElement={`#grid-${Number(activeSubPage) + 1}`}
                      menuData={menuData}
                      subMenuData={subMenuData}
                      onMovieClick={handleMovieClick}
                      activeSubPageParent={activeSubPage}
                      {...props}
                    />
                  );

                  // ✅ Case: child playlists
                  if (subPageData?.hasChildPlaylist) {
                    return (
                      <>
                        <div className="side-menu">
                          <SideMenu
                            subMenuData={subMenuData}
                            activeSubPage={activeSubPage}
                            handleSubPageChange={handleSubPageChange}
                          />
                        </div>

                        <div className="page-content horizontal-list" id="page-content">
                          {subPageData.childPlaylists.length > 0 ? (
                            subPageData.childPlaylists.map((pd) =>
                              renderGrid({
                                key: pd.id,
                                videosCount: pd.videosCount,
                                seriesCount: pd.seriesCount,
                                activeSubPageParent: activeSubPage,
                                activeSubPage: pd.id,
                                title: pd.title,
                                gridPlaylistId: pd.id,
                                type: pd.type,
                              })
                            )
                          ) : (
                            <div className="video_not_found">
                              <h5 className="m-0">No Videos Available</h5>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  }

                  // ✅ Case: normal page
                  const renderedItems = subMenuData.map((smd, idx) => {
                    const videoInfo = videosData[smd.id] || {};
                    const { videosCount = 0, seriesCount = 0, type = "" } = videoInfo;
                    const keyUpElement = idx === 0 ? ".top-navigation .prj-element.active" : `#hl-${subMenuData[idx - 1].id} .prj-element`;
                    const keyDownElement = idx + 1 === subMenuData.length ? "" : `#hl-${subMenuData[idx + 1].id} .prj-element`;
                    const firstLiveIndex = subMenuData.findIndex(item => item.is_live_events === 1);

                    if (smd.is_live_events === 1 && idx === firstLiveIndex) {
                      return (
                        <LiveStreamComponent
                          id={smd.id}
                          title={smd.title}
                          key={`live-${smd.id}`}
                          activePage={activePage}
                          activeSubPage={`${smd.id}`}
                          type={type}
                          menuData={menuData}
                          subMenuData={subMenuData}
                        />
                      );
                    }

                    if (videosCount > 0) {
                      return (
                        <HorizontalList
                          id={smd.id}
                          title={smd.title}
                          containerId={`hl-${smd.id}`}
                          videosCount={videosCount}
                          type={type}
                          activePage={activePage}
                          activeSubPage={`${smd.id}`}
                          seriesCount={seriesCount}
                          menuData={menuData}
                          subMenuData={subMenuData}
                          key={`hl${smd.id}`}
                          keyUpElement={keyUpElement}
                          keyDownElement={keyDownElement}
                          activeSubPageParent={activeSubPage}
                        />
                      );
                    }

                    if (seriesCount > 0) {
                      return (
                        <SeriesHorizontalList
                          id={smd.id}
                          title={smd.title}
                          containerId={`hl-${smd.id}`}
                          videosCount={videosCount}
                          seriesCount={seriesCount}
                          type={type}
                          activePage={activePage}
                          activeSubPage={`${smd.id}`}
                          menuData={menuData}
                          subMenuData={subMenuData}
                          key={`hl${smd.id}`}
                          keyUpElement={keyUpElement}
                          keyDownElement={keyDownElement}
                          activeSubPageParent={activeSubPage}
                          gridPlaylistId={smd.id}
                        />
                      );
                    }
                    return null;
                  });

                  // ✅ Only show once if nothing got rendered
                  const hasContent = renderedItems.some((item) => item !== null);
                  return (
                    <>
                      {showSidebar && (
                        <div className="side-menu">
                          <SideMenu
                            subMenuData={subMenuData}
                            activeSubPage={activeSubPage}
                            handleSubPageChange={handleSubPageChange}
                          />
                        </div>
                      )}
                      <div className={`page-content ${showVideo ? "has-bg-video" : ""}`} id="page-content">
                        {hasContent ? (
                          <>
                            {renderedItems}
                          </>
                        ) : (
                          <>
                            <div className="side-menu">
                              <SideMenu
                                subMenuData={subMenuData}
                                activeSubPage={activeSubPage}
                                handleSubPageChange={handleSubPageChange}
                              />
                            </div>
                            <div className="video_not_found">
                              <h5 className="m-0">No Videos Available</h5>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </>
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
    layout: PropTypes.string,
    bgVideo: PropTypes.string,
  }).isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default Home;
