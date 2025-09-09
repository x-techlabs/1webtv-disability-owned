import React from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/16/solid';

const ScrollToTop = () => {
    const scrollToTop = () => {
        const scrollableElements = [];
        document.querySelectorAll('*').forEach(el => {
            if (el.scrollHeight > el.clientHeight) {
                scrollableElements.push(el);
            }
        });
    
        let scrolled = false;
        scrollableElements.forEach(el => {
            if (el.scrollTop > 0) {
                el.scrollTo({ top: 0, behavior: 'smooth' });
                scrolled = true;
            }
        });
    
        if (!scrolled && scrollableElements.length > 0) {
            const largest = scrollableElements.reduce((prev, current) =>
                current.scrollHeight > prev.scrollHeight ? current : prev
            );
            largest.scrollTo({ top: 0, behavior: 'smooth' });
        }
    
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='scroll-to-top' onClick={scrollToTop}>
            <ArrowUpCircleIcon></ArrowUpCircleIcon>
        </div>
    )
}

export default ScrollToTop
