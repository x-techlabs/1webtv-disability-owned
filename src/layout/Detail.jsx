import React from 'react';
import PropTypes from 'prop-types';

const Detail = ({ children }) => (
  <div className="fullscreen-container-fixed" id="fullscreen-container-fixed">
    {children}
  </div>
);

Detail.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Detail;
