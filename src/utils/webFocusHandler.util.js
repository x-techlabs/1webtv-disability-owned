/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
import videojs from 'video.js';
import { localStorageKey } from './localCache.util';
import { PLATFORMS } from '../config/const.config';

window.document.addEventListener(
  'keydown',
  (event) => {
    const getFocusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );
    if (getFocusedElements.length === 0) return;

    const element = getFocusedElements[0];
    const elementFocusDef = element.dataset;

    switch (event.code) {
      case 'ArrowDown':
      case 40:
        event.preventDefault();
        if (
          elementFocusDef.focusDown &&
          elementFocusDef.focusDown !== 'false'
        ) {
          const nextElements = window.document.querySelectorAll(
            elementFocusDef.focusDown
          );
          if (nextElements.length > 0) {
            // Remove focus from other elements
            // Array.from(
            //   document.querySelectorAll('.prj-element.focused')
            // ).forEach((el) => el.classList.remove('focused'));
            if (element) {
              element.classList.remove('focused');
            }
            if (element.classList[1] === 'input-class') {
              element.blur();
            }
            if (nextElements[0].classList[1] === 'input-class') {
              nextElements[0].classList.add('focused');
              nextElements[0].focus();
            }
            // Focus requirement element
            nextElements[0].classList.add('focused');
            // nextElements[0].focus();

            // Handle scroll
            if (
              nextElements[0].dataset?.onSelfFocus &&
              nextElements[0].dataset?.onSelfFocus !== 'false'
            ) {
              const focusHandleElements = window.document.querySelectorAll(
                nextElements[0].dataset.onSelfFocus
              );
              if (focusHandleElements.length > 0) {
                focusHandleElements[0].click();
              }
            }
          }
        }
        break;

      case 'ArrowUp':
      case 38:
        event.preventDefault();
        if (elementFocusDef.focusUp && elementFocusDef.focusUp !== 'false') {
          const nextElements = window.document.querySelectorAll(
            elementFocusDef.focusUp
          );
          if (nextElements.length > 0) {
            // Remove focus from other elements
            // Array.from(
            //   document.querySelectorAll('.prj-element.focused')
            // ).forEach((el) => el.classList.remove('focused'));
            if (element !== undefined) {
              element.classList.remove('focused');
            }
            if (element.classList[1] === 'input-class') {
              element.blur();
            }
            if (nextElements[0].classList[1] === 'input-class') {
              nextElements[0].classList.add('focused');
              nextElements[0].focus();
            }

            // Focus requirement element
            nextElements[0].classList.add('focused');

            // Handle scroll
            if (
              nextElements[0].dataset?.onSelfFocus &&
              nextElements[0].dataset?.onSelfFocus !== 'false'
            ) {
              const focusHandleElements = window.document.querySelectorAll(
                nextElements[0].dataset.onSelfFocus
              );
              if (focusHandleElements.length > 0) {
                focusHandleElements[0].click();
              }
            }
          }
        }
        break;

      case 'ArrowLeft':
      case 37:
        event.preventDefault();
        if (
          elementFocusDef.focusLeft &&
          elementFocusDef.focusLeft !== 'false'
        ) {
          const nextElements = window.document.querySelectorAll(
            elementFocusDef.focusLeft
          );

          if (nextElements.length > 0) {
            // Remove focus from other elements
            // Array.from(
            //   document.querySelectorAll('.prj-element.focused')
            // ).forEach((el) => el.classList.remove('focused'));
            if (element) {
              element.classList.remove('focused');
            }
            // Focus requirement element
            nextElements[0].classList.add('focused');

            // Handle scroll
            if (
              nextElements[0].dataset?.onSelfFocus &&
              nextElements[0].dataset?.onSelfFocus !== 'false'
            ) {
              const focusHandleElements = window.document.querySelectorAll(
                nextElements[0].dataset.onSelfFocus
              );
              if (focusHandleElements.length > 0) {
                focusHandleElements[0].click();
              }
            }
          }
        }
        break;

      case 'ArrowRight':
      case 39:
        event.preventDefault();
        if (
          elementFocusDef.focusRight &&
          elementFocusDef.focusRight !== 'false'
        ) {
          const nextElements = window.document.querySelectorAll(
            elementFocusDef.focusRight
          );
          if (nextElements.length > 0) {
            // Remove focus from other elements
            // Array.from(
            //   document.querySelectorAll('.prj-element.focused')
            // ).forEach((el) => el.classList.remove('focused'));

            if (element) {
              element.classList.remove('focused');
            }
            // Focus requirement element
            nextElements[0].classList.add('focused');

            // Handle scroll
            if (
              nextElements[0].dataset?.onSelfFocus &&
              nextElements[0].dataset?.onSelfFocus !== 'false'
            ) {
              const focusHandleElements = window.document.querySelectorAll(
                nextElements[0].dataset.onSelfFocus
              );
              if (focusHandleElements.length > 0) {
                focusHandleElements[0].click();
              }
            }
          }
        }
        break;

      case 'Enter':
      case 'NumpadEnter':
        event.preventDefault();
        let focusStack = window.localStorage.getItem(
          localStorageKey.lastFocusStack
        );
        focusStack = JSON.parse(focusStack || '[]');
        if (!element.id.includes('detailitem')) {
          if (
            element.id !== 'play-pause' &&
            element.id !== 'fast-forward' &&
            element.id !== 'rewind' &&
            element.id !== 'play-btn'
          ) {
            focusStack.push(element.id);
          }
          // focusStack.push(element.id);
        }
        if (element) {
          if (!window.document.getElementById('play-pause')) {
            element.classList.remove('focused');
          }
        } else {
          element.classList.add('focused');
        }
        window.localStorage.setItem(
          localStorageKey.lastFocusStack,
          JSON.stringify(focusStack)
        );
        element.click();
        break;

      case 13:
        event.preventDefault();
        element.click();
        break;

      case 'Escape':
      case 'BrowserBack':
      case 'Backspace':
        if (!PLATFORMS.WEB) {
          // event.preventDefault();
          if (window.history.state !== 'backhandler') {
            // put your back handler code here
            if (window.document.getElementById('back-to-page-video')) {
              window.document.getElementById('back-to-page-video').click();
              window.history.pushState('backhandler', null, null);
            } else if (window.document.getElementById('back-to-page')) {
              window.document.getElementById('back-to-page').click();
              window.history.pushState('backhandler', null, null);
            } else {
              window.open('', '_self').close();
            }
          } else if (window.document.getElementById('back-to-page-video')) {
            window.document.getElementById('back-to-page-video').click();
          } else if (window.document.getElementById('back-to-page')) {
            window.document.getElementById('back-to-page').click();
          }
        }
        break;

      case 'MediaPlayPause':
      // case 'KeyP ':
      //   event.preventDefault();
      //   if (videojs('player').ads.adType === null) {
      //     if (videojs('player').paused()) {
      //       videojs('player').play();
      //     } else {
      //       videojs('player').pause();
      //     }
      //   }
        break;
      case 'MediaFastForward':
      // case 'KeyF':
      //   event.preventDefault();
      //   if (videojs('player').ads.adType === null) {
      //     videojs('player').currentTime(videojs('player').currentTime() + 10);
      //   }
        break;

      case 'MediaRewind':
      // case 'KeyB':
      //   event.preventDefault();
      //   if (videojs('player').ads.adType === null) {
      //     videojs('player').currentTime(videojs('player').currentTime() - 10);
      //   }
        break;

      default:
        break;
    }
  },
  false
);
