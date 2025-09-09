import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../common/ScrollToTop';

const EpisodesTabs = ({ episodes }) => {
    // Group episodes by season
    const grouped = episodes.reduce((acc, ep) => {
        const season = `Season ${ep.season}`;
        if (!acc[season]) acc[season] = [];
        acc[season].push(ep);
        return acc;
    }, {});

    const seasons = Object.keys(grouped);
    const [activeSeason, setActiveSeason] = useState(seasons[0]);

    if (!episodes || episodes.length === 0) return null;
    
    return (
        <div className='season-episode-tabs'>
            {/* Tab headers */}
            <div className='tab-header'>
                {seasons.map((season) => (
                    <button
                        key={season}
                        onClick={() => setActiveSeason(season)}
                        className={`${activeSeason === season ? 'tabs-button active' : 'tabs-button'}`}             >
                        {season}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className='tab-series-data'>
                <div className='shown-series-season-episode-count'>
                    {activeSeason} - {grouped[activeSeason].length} Episode{grouped[activeSeason].length > 1 ? 's' : ''}
                </div>
                <div className='episode-list-main'>
                    {grouped[activeSeason].map((ep, idx) => (
                        <div key={ep.id || idx} className='series-episode-item'>
                            <div className='episode-thumbnail'>
                                <div className="overlay-box">
                                    <div className="btns-group">
                                        <Link
                                            to={`/watch/featured/${encodeURIComponent(ep.title)}`}
                                            className="btn" type='button'
                                        >
                                            Play
                                        </Link>
                                    </div>
                                </div>
                                <img src={ep.poster_16_9} alt={ep.title} className='series-episode-image-item'/>
                            </div>
                            <div className='episode-content'>
                                <div className='title'>{ep.title}</div>
                                <div className='description'>{ep.description}</div>
                                <p className='episode-duration'>Duration: <span>{Math.ceil(ep.duration / 60)} min</span></p>
                                <p className='episode-release-data'>Released: <span>{ep.releaseDate}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollToTop />
            </div>
        </div>
    );
};

export default EpisodesTabs;
