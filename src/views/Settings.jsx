import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MainLayout from '../layout/Main';
import SideMenu from '../components/common/SideMenu';
import LandingPageData from '../static/landingPage';

const Settings = ({ menuData, activePage, handlePageChange }) => {
  const subMenuData = [
    {
      id: 'about',
      title: 'About HBCUgo',
    },
    {
      id: 'terms',
      title: 'Terms of Use',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
    },
    {
      id: 'donotsell',
      title: 'Do Not Sell My Info',
    },
    {
      id: 'ccpa',
      title: 'CCPA',
    },
    {
      id: 'contact',
      title: 'Contact Us',
    },
  ];

  const qrcodeBase =
    'https://chart.googleapis.com/chart?cht=qr&chs=345x345&chld=L%7C1&chl=';
  const subMenuInfo = {
    about: {
      text: 'To learn more about HBCUgo.TV, please visit the URL below or scan the QR code:',
      url: 'hbcugo.tv/about',
      qrcode: `${qrcodeBase}${encodeURIComponent('hbcugo.tv/about')}`,
    },
    terms: {
      text: 'To view our terms & conditions, please visit the URL below or scan the QR code:',
      url: 'hbcugo.tv/terms-of-use',
      qrcode: `${qrcodeBase}${encodeURIComponent('hbcugo.tv/terms-of-use')}`,
    },
    privacy: {
      text: 'To view our privacy policy, please visit the URL below or scan the QR code:',
      url: 'hbcugo.tv/privacy-policy',
      qrcode: `${qrcodeBase}${encodeURIComponent('hbcugo.tv/privacy-policy')}`,
    },
    donotsell: {
      text: 'To view our legal information, please visit the URL below or scan the QR code:',
      url: 'hbcugo.tv/donotsellmyinfo',
      qrcode: `${qrcodeBase}${encodeURIComponent('hbcugo.tv/donotsellmyinfo')}`,
    },
    ccpa: {
      text: 'To view our legal information, please visit the URL below or scan the QR code:',
      url: 'htbugo.tv/ccpa',
      qrcode: `${qrcodeBase}${encodeURIComponent('htbugo.tv/ccpa')}`,
    },
    contact: {
      text: 'If you have questions or feedback, please send us an email to the address below:',
      url: 'support@hbcugo.tv',
      qrcode: `${qrcodeBase}${encodeURIComponent('support@hbcugo.tv')}`,
    },
  };

  const [activeSubPage, setActiveSubPage] = useState('about');

  const handleSubPageChange = (page) => {
    setActiveSubPage(page.toString());
  };

  return (
    <MainLayout
      menuData={menuData}
      activePage={activePage}
      handlePageChange={handlePageChange}
      copyRightText={LandingPageData.copyRight}
    >
      <div className="page-container">
        <div className="side-menu">
          <SideMenu
            subMenuData={subMenuData}
            activeSubPage={activeSubPage}
            handleSubPageChange={handleSubPageChange}
          />
        </div>
        <div className="page-content" id="page-content">
          <div className="settings-container">
            <div className="settings-qrcode">
              <img src={subMenuInfo[activeSubPage].qrcode} alt="qrcode" />
            </div>
            <div className="settings-section">
              <div className="title">{subMenuInfo[activeSubPage].text}</div>
              <div className="link">{subMenuInfo[activeSubPage].url}</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

Settings.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default Settings;
