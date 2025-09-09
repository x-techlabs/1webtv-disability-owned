/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { VIDEO_TYPES } from '../../config/const.config';
import convertSecToTime from '../../utils/timeformat.util';
import landscape_dummy_poster from "../../assets/images/landscape_dummy_poster.png";
import portrait_dummy_poster from "../../assets/images/portrait_dummy_poster.png";

const Series = ({
    id: seriesId,
    title,
    shortDescription,
    long_description,
    poster,
    release_date,
    episode_count,
    type,
    dataFocusLeft,
    dataFocusRight,
    dataFocusUp,
    dataFocusDown,
    dataOnSelfFocus,
    handleShowDetailPage,
    dataOnPagination,
    activePage,
    activeSubPage
}) => {
    const page_url = activePage ? activePage : localStorage.getItem('pageClick');
    const getactiveSubPage = localStorage.getItem('pageSubClick');
    const pageSubClick = getactiveSubPage ? getactiveSubPage : activeSubPage;

    const fallbackImage = (error, titleName, isPortrait) => {
        if (error?.target) {
            error.target.src = isPortrait ? portrait_dummy_poster : landscape_dummy_poster;
            error.target.alt = titleName;
            error.target.className = isPortrait ? 'error-image-default-image portrait' : 'error-image-default-image landscape';
        }
        return error;
    };

    return (
        <div>
            <Link
                to={`/movies/${page_url}/${pageSubClick}/${encodeURIComponent(title)}`}
                className={`media-element ${poster
                    } prj-element`}
                data-focus-left={dataFocusLeft || false}
                data-focus-right={dataFocusRight || false}
                data-focus-up={dataFocusUp || false}
                data-focus-down={dataFocusDown || false}
                data-on-self-focus={dataOnSelfFocus || false}
                data-focus-pagination={dataOnPagination}
                onClick={() => {
                    handleShowDetailPage({
                        id: seriesId,
                        title,
                        shortDescription,
                        long_description,
                        poster,
                        release_date,
                        episode_count,
                        activePage,
                        activeSubPage
                    });
                }}
                role="none"
            >
                <div className="img">                    
                    <div className="overlay-box">
                        <div className="btns-group">
                            <a href="#" className='btn' type='button'>Play</a>
                            <button className='btn' type='button'>Details</button>
                        </div>
                    </div>
                    <div className="img-container">
                        <img
                            id={`target-image-h-v-${seriesId}`}
                            src={poster}
                            alt={title}
                            loading="lazy"
                            onError={(error) => fallbackImage(error, title)}
                        />
                    </div>
                </div>

                {type !== VIDEO_TYPES.MOVIES && <p className="title">{title}</p>}
                {type === VIDEO_TYPES.VIDEO && (
                    <p className="sub-title">{long_description}</p>
                )}
            </Link>
        </div>
    );
};

Series.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    shortDescription: PropTypes.string,
    long_description: PropTypes.string,
    poster: PropTypes.string,
    release_date: PropTypes.string,
    episode_count: PropTypes.string,
    dataFocusLeft: PropTypes.string,
    dataFocusRight: PropTypes.string || PropTypes.boolean,
    dataFocusUp: PropTypes.string,
    dataFocusDown: PropTypes.string,
    dataOnSelfFocus: PropTypes.string,
    handleShowDetailPage: PropTypes.func,
    dataOnPagination: PropTypes.string,
};

export default Series;
