import React from 'react';
import EmptyLayout from '../layout/Empty';
import logoImage from '../assets/images/disability_owned/logo.png';
import loadingImg from '../assets/images/icons/Spinner-1s-200px-animated.svg';

const SplashScreen = () => (
  <EmptyLayout>
    <div className="splashscreen">
      <img
        src={logoImage}
        alt="logoImage-splash"
        className="splash-image-logo-web"
      />
      <img
        src={loadingImg}
        className="web-loader-spalsh-screen"
        alt="web-loader"
      />
    </div>
  </EmptyLayout>
);

export default SplashScreen;
