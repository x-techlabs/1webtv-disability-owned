import {
  addLocalStorageData,
  getLocalStorageData,
  localStorageKey,
} from './localCache.util';

const restoreFocus = async (defaultFocus = '') => {
  const getFocusedElements = window.document.querySelectorAll(
    '.prj-element.focused'
  );
  getFocusedElements.forEach((e) => {
    window.document.getElementById(`${e.id}`).classList.remove('focused');
  });
  // if (window.document.getElementById('top-menu-0')) {
  //   window.document.getElementById('top-menu-0').classList.add('focused');
  // }
  const lastFocused =
    (await JSON.parse(getLocalStorageData(localStorageKey.lastFocusStack))) ||
    [];

  if (lastFocused.length > 0) {
    const focusElm = lastFocused.pop();
    const element = window.document.querySelectorAll(`#${focusElm}`);
    if (element.length > 0) {
      element[0].classList.add('focused');
      element[0].parentNode.click();
      await addLocalStorageData(
        localStorageKey.lastFocusStack,
        JSON.stringify(lastFocused)
      );
    } else if (defaultFocus) {
      window.document.getElementById(defaultFocus).classList.add('focused');
    } else {
      const elements = window.document.querySelectorAll(
        '.page-container .prj-element'
      );
      if (elements.length > 0) {
        elements[0].classList.add('focused');
      }
    }
  } else if (defaultFocus) {
    window.document.getElementById(defaultFocus).classList.add('focused');
  } else {
    const elements = window.document.querySelectorAll(
      '.page-container .prj-element'
    );

    if (elements.length > 0) {
      elements[0].classList.add('focused');
    }
  }
};

export default restoreFocus;
