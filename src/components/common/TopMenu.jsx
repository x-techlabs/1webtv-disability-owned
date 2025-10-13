/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { APP_PAGES, PLATFORMS } from '../../config/const.config';
import logoImg from "../../assets/images/disability_owned/logo.png";
import scrollAppView from '../../utils/viewScroll.util';
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

const TopMenu = ({
  menuData,
  activePage,
  handlePageChange,
  activePageLayoutType,
  isAnyLiveEvent,
}) => {
  const sidebarRef = useRef(null);
  const { videoTitle } = useParams();
  const navigate = useNavigate();
  const appName = process.env.REACT_APP_NAME;
  const location = useLocation();
  const menuDataLength = menuData === undefined ? 0 : menuData.length;
  const isDetailPage = location.pathname.match(/^\/movies\/\d+\/\d+\/[^/]+$/);
  const isSeriesDetailPage = location.pathname.match(/^\/series\/\d+\/\d+\/[^/]+$/);
  const [showSideMenu, setshowSideMenu] = useState(false);
  // platform web state variable
  const [colorChange, setColorchange] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1400);
  const currentPath = decodeURIComponent(location.pathname.split("/")[1] || "");

  const [query, setQuery] = useState('');
  const timeoutIdRef = useRef(null);
  const seriesId = window.location.pathname.split('/')[4];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [location.search]);

  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (newQuery.length === 0) {
      timeoutIdRef.current = setTimeout(() => {
        if (newQuery.trim().length === 0) {
          navigate('/', { replace: true });
        }
      }, 500);
      return;
    }
  
    if (newQuery.length < 3) return;
    timeoutIdRef.current = setTimeout(() => {
      navigate(`/search?search=${encodeURIComponent(newQuery)}`, { replace: true });
    }, 1500);
  };

  const handleScroll = () => {
    const focusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );
    if (focusedElements.length > 0) {
      scrollAppView(focusedElements[0]);
      if (
        activePageLayoutType !== 'grid' &&
        activePage !== 'search'
      ) {
        if (focusedElements[0].id === 'top-menu-0') {
          if (window.document.querySelector('.live-video-container')) {
            if (window.document.querySelectorAll('.page-container')) {
              window.document.querySelectorAll(
                '.page-container'
              )[0].style.marginTop = `788px`;
            }
          }
        }
      }
    }
  };

  const openScreen = () => {
    if (PLATFORMS.WEB) {
      navigate('/');
    }
  };

  const changeNavbarColor = () => {
    if (PLATFORMS.WEB) {
      if (window.scrollY >= 5) {
        setColorchange(true);
      } else {
        setColorchange(false);
      }
    }
  };
  if (PLATFORMS.WEB) {
    window.addEventListener('scroll', changeNavbarColor);
  }

  const mobMenu = () => {
    setshowSideMenu(true);
    const bodyEl = document.body;
    if (bodyEl) {
      bodyEl.classList.add("menu-open");
    }
  };
  const closeNavBar = () => {
    setshowSideMenu(false);
    const bodyEl = document.body;
    if (bodyEl) {
      bodyEl.classList.remove("menu-open");
    }
  };
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        showSideMenu
      ) {
        setshowSideMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSideMenu]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1400);
      setshowSideMenu(false);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {menuDataLength > 0 && (
        <nav
          className={`nav top-navigation navbar ${
            colorChange ? "colorChange" : ""
          } ${(isDetailPage || isSeriesDetailPage) ? "detailPage_navbar" : ""}
          ${isAnyLiveEvent ? "live-navbar" : ""}`}
          id="top-navigation"
        >
          <button
            type="button"
            className="hide"
            id="top-bar-tabs"
            onClick={handleScroll}
          >
            Scroll
          </button>
          <div className="nav-left menu-links align-items-center justify-content-center justify-content-md-between">            
              <div className="col-lg-2 col-md-3" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                <div className="flex-box">
                <button
                  type="submit"
                  onClick={mobMenu}
                  className="my-button"
                  id="my-button"
                  name="my-button"
                  aria-label="Open menu"
                >
                  <svg viewBox="0 0 100 80" width="30" style={{ fill: 'white', position: 'relative', top: '2px' }}>
                    <rect width="80" height="8" />
                    <rect y="30" width="40" height="8" />
                    <rect y="60" width="80" height="8" />
                  </svg>
                </button>
              </div>
              <div onClick={() => openScreen()}>
                <Link to='/' className="link brand-logo" onClick={() => handlePageChange(menuData[0].id)} alt={appName || "Disability Owned"}>
                <img
                  className={`${colorChange ? 'brand-logo-scroll' : ''} ${activePage !== APP_PAGES.LANDINGPAGE ? 'brand-logo-home' : ''
                    }`}
                  src={logoImg}
                  alt={appName || "Disability Owned"}
                  name={appName}
                />
              </Link>
              </div>
            </div>

          <div className="tabs-desktop col-12 col-md-auto">
            <div className={`menu-items ${!isMobileView && (videoTitle || seriesId) ? "menu-items-hidden-lg-screen" : ""}`}>
              {menuData.slice(0, 5).map((item, idx) => (
                <Link
                  to={`/${encodeURIComponent(item.title)}`}
                  id={`top-menu-${idx}`}
                  className={`link menu-item prj-element
                    ${currentPath === item.title ? " active focused" : ""}
                    ${colorChange || Number(activePage) !== Number(APP_PAGES.LANDINGPAGE) ? " scroll-top-menu" : ""}
                  `}
                  key={`menu-${item.id}`}
                  onClick={() => handlePageChange(item.id)}
                  data-focus-left={idx === 0 ? false : `#top-menu-${idx - 1}`}
                  data-focus-right={
                    idx + 1 === menuDataLength
                      ? '#top-menu-search'
                      : `#top-menu-${idx + 1}`
                  }
                  data-focus-up={false}
                  data-focus-down=".page-container .prj-element"
                >
                  {item.title}
                </Link>
              ))}
              <Link
                to={`/about-us`}
                id={`top-menu-support`}
                className={`link menu-item prj-element scroll-top-menu ${decodeURIComponent(window.location.pathname) === '/about-us' ? 'active focused' : ''}`}
                aria-hidden
                data-focus-up={false}
                data-focus-down=".page-container .prj-element"
              >
                About Us
              </Link>
            </div>
          </div>

          <div className={showSideMenu ? 'tabs show-top-menubar' : 'tabs col-12 col-md-auto'}
            role="none"
            id="top-bar-tabs"
          >
            <div className="nav-close-btn-div">
              <button
                className="nav-close-btn"
                type="submit"
                title="Close Navigation"
                onClick={() => closeNavBar()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="default-ltr-cache-v1ob21 e164gv2o4"
                  data-name="Plus"
                  alt=""
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className={`menu-items ${!isMobileView && (videoTitle || seriesId) ? "menu-items-hidden-lg-screen" : ""}`}>
              {menuData.map((item, idx) => (
                <Link
                  to={`/${encodeURIComponent(item.title)}`}
                  id={`top-menu-${idx}`}
                  className={`link menu-item prj-element
                    ${currentPath === item.title ? " active focused" : ""}
                    ${colorChange || Number(activePage) !== Number(APP_PAGES.LANDINGPAGE) ? " scroll-top-menu" : ""}
                  `}
                  key={`menu-${item.id}`}
                  onClick={() => handlePageChange(item.id)}
                  data-focus-left={idx === 0 ? false : `#top-menu-${idx - 1}`}
                  data-focus-right={
                    idx + 1 === menuDataLength
                      ? '#top-menu-search'
                      : `#top-menu-${idx + 1}`
                  }
                  data-focus-up={false}
                  data-focus-down=".page-container .prj-element"
                >
                  {item.title}
                </Link>
              ))}
              <Link
                to={`/about-us`}
                id={`top-menu-support`}
                className={`link menu-item prj-element scroll-top-menu ${decodeURIComponent(window.location.pathname) === '/about-us' ? 'active focused' : ''}`}
                aria-hidden
                data-focus-up={false}
                data-focus-down=".page-container .prj-element"
              >
                About US
              </Link>
            </div>
          </div>

            <div className="nav-right col-lg-2 col-md-4">
              <div className="mobile-search" onClick={toggleSearch}>
                <MagnifyingGlassIcon className="size-6 text-blue-500 cursor-pointer" />
              </div>
              <div className="search-box">
                <MagnifyingGlassIcon className="size-6 text-blue-500" />
                <input
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div className={`search-mobile ${showSearch ? "searchShow" : ""}`}>
            <div className="input-position">
              <MagnifyingGlassIcon className="searchIcon" />
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </nav>

      )}
    </>

  );
};

TopMenu.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  handlePageChange: PropTypes.func.isRequired,
  activePageLayoutType: PropTypes.string,
};

export default TopMenu;
