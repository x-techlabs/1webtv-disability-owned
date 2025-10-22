/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import LandingPageData from '../../static/landingPage';
import MainLayout from '../../layout/Main';
import { Link } from 'react-router-dom';

const LandingPage = ({
  menuData,
  activePage,
  activePageLayout,
  handlePageChange,
  landingPageButton,
}) => {
  // const [activeDropDown, setActiveDropDown] = useState();
  // const [toggle, setToggle] = useState(false);

  // const openDropDown = (id) => {
  //   setActiveDropDown(id);
  //   setToggle(!toggle);
  // };

  return (
    <MainLayout
      menuData={menuData}
      activePage={activePage}
      handlePageChange={handlePageChange}
      activePageLayoutType={activePageLayout.layout}
      copyRightText={LandingPageData.copyRight}
    >
      <div className="landing-page-main-container">
        <div
          className="landing-page-main"
          style={{
            // backgroundImage: `url('${LandingPageData.topSection.bg_img}')`,
            height: '100vh',
          }}
        >
          <div id="overlay" />
          <div className="landing-page-container">
            {LandingPageData.topSection.heading && (
              <h1>{LandingPageData.topSection.heading}</h1>
            )}
            {LandingPageData.topSection.sub_heading && (
              <p>{LandingPageData.topSection.sub_heading}</p>
            )}
            {LandingPageData.topSection.description && (
              <h3>{LandingPageData.topSection.description}</h3>
            )}
            {LandingPageData.topSection.button_text && (
              <Link
                to={`/movies/${landingPageButton}`}
                className="landing-page-explore-btn"
                type="button"
                // onClick={() => landingPageButton()}
              >
                {LandingPageData.topSection.button_text}
              </Link>
            )}
          </div>
        </div>
        <div className="landing-page-underline-section" />
      </div>
    </MainLayout>
  );
};
LandingPage.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  activePage: PropTypes.string.isRequired,
  activePageLayout: PropTypes.shape({
    layout: PropTypes.string,
    bgVideo: PropTypes.string,
  }).isRequired,
  handlePageChange: PropTypes.func.isRequired,
  landingPageButton: PropTypes.number,
};

export default LandingPage;
