/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
const scrollAppView = (element) => {
  element.scrollIntoView({
    behavior: 'auto',
    block: 'start',
    inline: 'start',
  });
};

export default scrollAppView;
