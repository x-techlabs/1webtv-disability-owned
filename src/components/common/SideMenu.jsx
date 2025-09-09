import React from 'react';
import PropTypes from 'prop-types';

const SideMenu = ({ subMenuData, activeSubPage, handleSubPageChange }) => {
  const subMenuDataLength = subMenuData.length;

  return (
    <div className="side-nav">
      {subMenuData.map((item, idx) => (
        <a
          id={`side-menu-${idx}`}
          className={`link prj-element ${
            activeSubPage === item.id.toString() ? 'active focused' : ''
          }`}
          key={`sub-menu-${item.id}`}
          aria-hidden
          onClick={() => handleSubPageChange(item.id)}
          data-focus-left={false}
          data-focus-right=".page-content .prj-element"
          data-focus-up={
            idx === 0
              ? '.top-navigation .prj-element.active'
              : `#side-menu-${idx - 1}`
          }
          data-focus-down={
            idx + 1 === subMenuDataLength ? false : `#side-menu-${idx + 1}`
          }
        >
          <span>{item.title}</span>
        </a>
      ))}
    </div>
  );
};

SideMenu.propTypes = {
  subMenuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  activeSubPage: PropTypes.string.isRequired,
  handleSubPageChange: PropTypes.func.isRequired,
};

export default SideMenu;
