// import {
//   addLocalStorageData,
//   getLocalStorageData,
//   localStorageKey,
// } from './localCache.util';

// Utility to convert seconds to display time
const convertSecToTime = (sec) => {
  const secNum = parseInt(sec, 10);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor(secNum / 60) % 60;
  const seconds = secNum % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? `0${v}` : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};

// const restoreFocus = async (defaultFocus = '') => {
//   const getFocusedElements = window.document.querySelectorAll(
//     '.prj-element.focused'
//   );
//   getFocusedElements.forEach((e) => {
//     window.document.getElementById(`${e.id}`).classList.remove('focused');
//   });
//   const lastFocused =
//     (await JSON.parse(getLocalStorageData(localStorageKey.lastFocusStack))) ||
//     [];

//   if (lastFocused.length > 0) {
//     const focusElm = lastFocused.pop();
//     const element = window.document.querySelectorAll(`#${focusElm}`);
//     if (element.length > 0) {
//       element[0].classList.add('focused');
//       element[0].parentNode.click();
//       await addLocalStorageData(
//         localStorageKey.lastFocusStack,
//         JSON.stringify(lastFocused)
//       );
//     } else if (defaultFocus) {
//       window.document.getElementById(defaultFocus).classList.add('focused');
//     } else {
//       const elements = window.document.querySelectorAll(
//         '.main-layout-container .prj-element'
//       );
//       if (elements.length > 0) {
//         elements[0].classList.add('focused');
//       }
//     }
//   } else if (defaultFocus) {
//     window.document.getElementById(defaultFocus).classList.add('focused');
//   } else {
//     const elements = window.document.querySelectorAll(
//       '.main-layout-container .prj-element'
//     );

//     if (elements.length > 0) {
//       elements[0].classList.add('focused');
//     }
//   }
// };

export default convertSecToTime;
