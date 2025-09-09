import React from 'react';
import PropTypes from 'prop-types';
import TopMenu from '../components/common/TopMenu';
import Footer from '../components/common/Footer';

const Main = ({
  menuData,
  activePage,
  handlePageChange,
  children,
  activePageLayoutType,
  copyRightText,
  isAnyLiveEvent
}) => (
  <>
    <div className="app-container">
      <TopMenu
        menuData={menuData}
        activePage={activePage}
        handlePageChange={handlePageChange}
        activePageLayoutType={activePageLayoutType}
        isAnyLiveEvent={isAnyLiveEvent}
      />

      {children}
    </div>

    <Footer
      menuData={menuData}
      activePage={activePage}
      handlePageChange={handlePageChange}
      activePageLayoutType={activePageLayoutType}
      copyRightText={copyRightText}
    />
  </>
);

Main.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  handlePageChange: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  activePageLayoutType: PropTypes.string,
  copyRightText: PropTypes.string.isRequired,
};

export default Main;
