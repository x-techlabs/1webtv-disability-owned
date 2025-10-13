import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { APP_PAGES, PAGE_LAYOUT, PLATFORMS } from './config/const.config';
import SplashScreenPage from './views/SplashScreen';
import SearchPage from './views/Search';
import SettingsPage from './views/Settings';
import { getAdditionalTopMenuDetails, getMainMenuData } from './services/channelData.service';
import './utils/webFocusHandler.util';
import './assets/styles/chota.css';
import './assets/styles/base.css';
import './assets/styles/web.css';
import {
  addLocalStorageData,
  getLocalStorageData,
} from './utils/localCache.util';
import DetailPageWrapper from './components/common/DetailPageWrapper';
import SeriesDetailPageWrapper from './components/common/SeriesDetailPageWrapper';
import SeeMoreDetailsPage from './components/pages/SeeMoreDetailsPage';
import SeriesSeeMoreDetailsPage from './components/common/SeriesSeeMoreDetailsPage';
import FeaturedPlayerWrapper from './components/common/FeaturedPlayerWrapper';
import LogoutButton from './components/common/LogoutButton';
import DynamicPage from './views/DynamicPage';
import AboutUs from './components/pages/AboutUs';

const App = () => {
  const location = useLocation();
  const [appLoaded, setAppLoaded] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [pageLayouts, setPageLayouts] = useState({
    layout: PAGE_LAYOUT.GRID,
    bgVideo: '',
  });
  const [activePage, setActivePage] = useState(APP_PAGES.LANDINGPAGE);
  const [activePageLayout, setActivePageLayout] = useState({
    layout: PAGE_LAYOUT.GRID,
    bgVideo: '',
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [mainResponse, additionalResponse] = await Promise.all([
          getMainMenuData(),
          getAdditionalTopMenuDetails(),
        ]);
        const menu = [];
        const layouts = {};
        const combinedMenus = [
          ...(mainResponse?.content?.top_menus || []),
          ...(additionalResponse?.content || []),
        ];
        combinedMenus.forEach((m) => {
          menu.push({
            id: m._id || m.id,
            title: m.title || m.name,
          });

          layouts[m._id] = {
            layout: m.playlist_layout,
            bgVideo: '',
          };
          if (
            Number(m.live_video_in_background) === 1 &&
            m.live_video_link !== ''
          ) {
            layouts[m._id].bgVideo = m.live_video_link;
          }
        });

        setMenuData(menu);
        setPageLayouts(layouts);
        if (PLATFORMS.FIRETV || PLATFORMS.SAMSUNG || PLATFORMS.LG) {
          setActivePage(menu[0].id.toString());
        }
        const getLocalData = getLocalStorageData('pageClick');
        if (menu.length === 0) {
          setActivePage(menu[0]?.id.toString());
          return;
        }

        const currentMenuName = window.location.pathname.split('/')[1];
        if (currentMenuName) {
          const matchedMenu = menu.find(item => item.title === decodeURIComponent(currentMenuName));
          if (matchedMenu) {
            setActivePage(matchedMenu.id);
            setActivePageLayout(layouts[matchedMenu.id] || { layout: PAGE_LAYOUT.RAIL, bgVideo: '' });
          } else if (getLocalData) {
            setActivePage(menu[0].id.toString());
            setActivePageLayout(layouts[menu[0].id]);
          }
        } else {
          setActivePage(menu[0].id.toString());
          setActivePageLayout(layouts[menu[0].id]);
        }

        setTimeout(() => {
          setAppLoaded(true);
        }, 1000);
      } catch (error) {
        // console.error('Failed to load menu data', error);
      }
    };
    fetchMenuData();
  }, []);  

  useEffect(() => {
    const bodyEl = document.body;
    bodyEl.classList.remove("menu-open");
    sessionStorage.removeItem('user_interacted');
  }, [activePage])

  const handlePageChange = (page) => {
    addLocalStorageData('pageClick', page);

    window.scrollTo(0, 0);
    if (pageLayouts[Number(page)]) {
      setActivePageLayout(pageLayouts[Number(page)]);
    } else {
      setActivePageLayout(PAGE_LAYOUT.GRID);
    }
    setActivePage(page.toString());
  };

    useEffect(() => {
    if (!menuData.length) return;

    const currentMenuName = location.pathname.split('/')[1];
    const matchedMenu = menuData.find(
      (item) => item.title === decodeURIComponent(currentMenuName)
    );

    if (matchedMenu) {
      setActivePage(matchedMenu.id.toString());
      setActivePageLayout(
        pageLayouts[matchedMenu.id] || { layout: PAGE_LAYOUT.RAIL, bgVideo: '' }
      );
    } else {
      setActivePageLayout(
        { layout: PAGE_LAYOUT.RAIL, bgVideo: '' }
      )
    }
  }, [location, menuData, pageLayouts]);

  if (!appLoaded) {
    return <SplashScreenPage />;
  }

  return (
    <>
      <Suspense fallback={<SplashScreenPage />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <Suspense fallback={<SplashScreenPage />}>
            <DynamicPage
              key={activePage}
              menuData={menuData}
              activePage={activePage}
              activePageLayout={activePageLayout}
              handlePageChange={handlePageChange}
            />
            </Suspense>
          }
        />
        <Route 
          path="/search"
          element={
            <Suspense fallback={<SplashScreenPage />}>
            <SearchPage
              menuData={menuData}
              activePage={activePage}
              activeSubPage={null}
              handlePageChange={handlePageChange}
            />
            </Suspense>
          }
        />
        <Route 
          path="/settings"
          element={
            <SettingsPage
              menuData={menuData}
              activePage={activePage}
              handlePageChange={handlePageChange}
            />
          }
        />
        <Route 
          path="/:playlistTitle" 
          element={
            <DynamicPage
              key={activePage}
              menuData={menuData}
              activePage={activePage}
              activePageLayout={activePageLayout}
              handlePageChange={handlePageChange}
            />
          }
        />
        <Route
          path="/:playlistTitle/:categoryTitle/:videoTitle"
          element={
            <DetailPageWrapper
              activePage={activePage}
              menuData={menuData}
              activePageLayout={activePageLayout}
              handlePageChange={handlePageChange}
              landingPageButton={menuData[0].id}
            />
          }
        />
        <Route 
          path="/channels/details/:seeMoreTitle"
          element={
            <SeeMoreDetailsPage
              activePage={activePage}
              activePageLayout={activePageLayout}
              handlePageChange={handlePageChange}
              menuData={menuData}
            />
          }
        />
        <Route
          path="/:playlistTitle/series/:categoryTitle/:seriesTitle"
          element={
            <SeriesDetailPageWrapper
              activePage={activePage}
              menuData={menuData}
              activePageLayout={activePageLayout}
              handlePageChange={handlePageChange}
              landingPageButton={menuData[0].id}
            />
          }
        />
        <Route 
          path="/series/details/:seeMoreTitle"
          element={
            <SeriesSeeMoreDetailsPage
              activePage={activePage}
              activePageLayout={activePageLayout}
              handlePageChange={handlePageChange}
              menuData={menuData}
            />
          }
        />
        <Route 
          path="/watch/featured/:videoTitle"
          element={
            <FeaturedPlayerWrapper
              activePage={activePage} 
            />
          }
        />
        <Route 
          path="/about-us"
          element={
            <AboutUs 
              activePage={activePage}
              activePageLayout={activePageLayout}
              handlePageChange={handlePageChange}
              menuData={menuData}
            />
          }
        />
        <Route path="*" element={<Navigate to={`/${encodeURIComponent(menuData[0].title)}`} />} />
      </Routes>
      <LogoutButton />
      </Suspense>
    </>
  );
};

export default App;
