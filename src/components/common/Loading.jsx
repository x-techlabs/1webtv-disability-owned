import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Loading = ({ showVideo }) => {
  const [dots, setDots] = useState(['dot1']);
  const animateLoader = () => {
    if (dots.length === 3) {
      setDots([]);
    } else {
      setDots([...dots, `dot${dots.length + 1}`]);
    }
  };

  useEffect(() => {
    setTimeout(animateLoader, 250);
  }, [dots]);

  return (
    <div className={showVideo ? 'loader loader-fix-pos' : 'loader'}>
      <div className="loader-text">
        <span className="loading-name">Loading</span>
        {dots.map((d) => (
          <span className={`dots dot-${d}`} key={`dot-${d}`}>
            &bull;
          </span>
        ))}
      </div>
    </div>
  );
};

Loading.propTypes = {
  showVideo: PropTypes.bool,
};

export default Loading;
