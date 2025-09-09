/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LandingPageData from '../../static/landingPage';
import MainLayout from '../../layout/Main';

const LandingPage = ({
  menuData,
  activePage,
  activePageLayout,
  handlePageChange,
  landingPageButton,
}) => {
  const [activeDropDown, setActiveDropDown] = useState();
  const [toggle, setToggle] = useState(false);

  const openDropDown = (id) => {
    setActiveDropDown(id);
    setToggle(!toggle);
  };

  return (
    <MainLayout
      menuData={menuData}
      activePage={activePage}
      handlePageChange={handlePageChange}
      activePageLayoutType={activePageLayout.layout}
      copyRightText={LandingPageData.copyRight}
    >
      <div className="landing-page-main-container">
        {LandingPageData.section_one && (
          <>
            {' '}
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="text-s-2">
                  {LandingPageData.section_one.heading && (
                    <h2>{LandingPageData.section_one.heading}</h2>
                  )}
                  {LandingPageData.section_one.description && (
                    <p>{LandingPageData.section_one.description}</p>
                  )}
                </div>
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_one.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_two && (
          <>
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_two.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
                <div className="text-s-2">
                  {LandingPageData.section_two.heading && (
                    <h2>{LandingPageData.section_two.heading}</h2>
                  )}
                  {LandingPageData.section_two.description && (
                    <p>{LandingPageData.section_two.description}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_three && (
          <>
            {' '}
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="text-s-2">
                  {LandingPageData.section_three.heading && (
                    <h2>{LandingPageData.section_three.heading}</h2>
                  )}
                  {LandingPageData.section_three.description && (
                    <p>{LandingPageData.section_three.description}</p>
                  )}
                </div>
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_three.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_four && (
          <>
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_four.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
                <div className="text-s-2">
                  {LandingPageData.section_four.heading && (
                    <h2>{LandingPageData.section_four.heading}</h2>
                  )}
                  {LandingPageData.section_four.description && (
                    <p>{LandingPageData.section_four.description}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_five && (
          <>
            {' '}
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="text-s-2">
                  {LandingPageData.section_five.heading && (
                    <h2>{LandingPageData.section_five.heading}</h2>
                  )}
                  {LandingPageData.section_five.description && (
                    <p>{LandingPageData.section_five.description}</p>
                  )}
                </div>
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_five.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_six && (
          <>
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_six.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
                <div className="text-s-2">
                  {LandingPageData.section_six.heading && (
                    <h2>{LandingPageData.section_six.heading}</h2>
                  )}
                  {LandingPageData.section_six.description && (
                    <p>{LandingPageData.section_six.description}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_eight && (
          <>
            {' '}
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="text-s-2">
                  {LandingPageData.section_eight.heading && (
                    <h2>{LandingPageData.section_eight.heading}</h2>
                  )}
                  {LandingPageData.section_eight.description && (
                    <p>{LandingPageData.section_eight.description}</p>
                  )}
                </div>
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_eight.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_nine && (
          <>
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_nine.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
                <div className="text-s-2">
                  {LandingPageData.section_nine.heading && (
                    <h2>{LandingPageData.section_nine.heading}</h2>
                  )}
                  {LandingPageData.section_nine.description && (
                    <p>{LandingPageData.section_nine.description}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_ten && (
          <>
            {' '}
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="text-s-2">
                  {LandingPageData.section_ten.heading && (
                    <h2>{LandingPageData.section_ten.heading}</h2>
                  )}
                  {LandingPageData.section_ten.description && (
                    <p>{LandingPageData.section_ten.description}</p>
                  )}
                </div>
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_ten.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.section_eleven && (
          <>
            <div className="landing-page-second-section">
              <div className="landingpage-text-container">
                <div className="image-s-2">
                  <img
                    src={LandingPageData.section_eleven.image}
                    alt="s-2-pic"
                    className="landing-s-2-pic"
                  />
                </div>
                <div className="text-s-2">
                  {LandingPageData.section_eleven.heading && (
                    <h2>{LandingPageData.section_eleven.heading}</h2>
                  )}
                  {LandingPageData.section_eleven.description && (
                    <p>{LandingPageData.section_eleven.description}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {LandingPageData.faq && (
          <>
            <div className="dropdown-section ">
              <h2>{LandingPageData.faq.main_title}</h2>
              <div>
                <ul>
                  {LandingPageData.faq.question_answer.map((data, id) => (
                    <li className="drop-down-li">
                      <h3>
                        <h4 onClick={() => openDropDown(id)}>
                          <span>{data.question}</span>
                          <span
                            id="drop-down-svg-plus"
                            className={
                              activeDropDown === id && toggle
                                ? 'cross-transition'
                                : ''
                            }
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="default-ltr-cache-v1ob21 e164gv2o4"
                              data-name="Plus"
                              alt="plus-svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </h4>
                      </h3>
                      <div
                        id={`drop-down-show-section-${id}`}
                        className={
                          activeDropDown === id && toggle
                            ? 'dropdown-hidden-section-visible dropdown-hidden-section'
                            : 'dropdown-default'
                        }
                      >
                        <span>{data.answer}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {LandingPageData.about_us && (
          <div className="about-uss">
            <div className="container">
              {LandingPageData.about_us.heading && (
                <h2 className="h1 text-center">
                  {LandingPageData.about_us.heading}
                </h2>
              )}
              {LandingPageData.about_us.description && (
                <p className="responsive-paragraph">
                  {LandingPageData.about_us.description}
                </p>
              )}
              {LandingPageData.about_us.mission && (
                <p className="responsive-paragraph">
                  {LandingPageData.about_us.mission}
                </p>
              )}
              {LandingPageData.about_us.experience && (
                <p className="responsive-paragraph">
                  {LandingPageData.about_us.experience}
                </p>
              )}
            </div>
          </div>
        )}
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
  landingPageButton: PropTypes.func.isRequired,
};

export default LandingPage;
