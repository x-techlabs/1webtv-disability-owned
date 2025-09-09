/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { footerSettings } from '../../services/channelData.service';

const Footer = ({ menuData, handlePageChange, copyRightText }) => {
  const [footerSettingDetails, setFooterSettingDetails] = useState();
  const location = useLocation();

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const footerSetting = await footerSettings();
        const response = footerSetting.content[0];
        setFooterSettingDetails(response);
      } catch (error) {
        console.error("Error fetching footer settings:", error);
      }
    };

    fetchFooterSettings();
  }, []);

  const shouldShowFooter = () => {
    if (!footerSettingDetails) return false;

    const topMenu = footerSettingDetails.left_section?.header_footer_pages || [];
    if (topMenu.includes("all")) return true;

    const currentPage = location.pathname.replace("/", "") || "Home";
    return topMenu.includes(currentPage);
  };

  return (
    footerSettingDetails?.enable_footer_section === 1 && shouldShowFooter() && (
      <div className="footer-main-container" style={{ backgroundColor: footerSettingDetails?.background_color }}>
          <div className="footer-links">
            <div className='footer-left-section'>
              {footerSettingDetails?.left_section?.visible_menu_bar === 1 && (
                menuData.map((item) => (
                  <Link to={`/${encodeURIComponent(item.title)}`} key={item.id} onClick={() => handlePageChange(item.id)}>{item.title}</Link>
                ))
              )}

              {footerSettingDetails?.left_section?.menu_names_url?.map((menu, index) => (
                <Link
                  key={index}
                  to={menu.menu_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                {menu.menu_name}
                </Link>
              ))}

              <button id="ot-sdk-btn" className="ot-sdk-show-settings">Manage Cookie Settings</button>
            </div>

            <div className='footer-right-section'>
              <h3 className='footer_right_side_header'>{footerSettingDetails?.right_section.header_name}</h3>
              <div className="footer-images">
                {footerSettingDetails?.right_section?.images?.map((img) => (
                  <Link
                    key={img.id}
                    to={img.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={img.image_url}
                      alt={footerSettingDetails?.right_section?.header_name || "footer image"}
                      className="footer-image"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
            <div className="copy-right-text text-white text-center">{copyRightText}</div>
      </div>
    )
  );
};

Footer.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  handlePageChange: PropTypes.func.isRequired,
  copyRightText: PropTypes.string.isRequired,
};

export default Footer;