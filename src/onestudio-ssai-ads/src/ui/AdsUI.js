import videojs from 'video.js';

import './AdInfoContainer.js';
import './AdTimelineContainer.js';
import './AdPreSkip.js';

const Component = videojs.getComponent('Component');


export default class AdsUI extends Component {

    constructor(player, options) {
        super(player, options)
    }

    createEl() {
	    return super.createEl('div', {
	      className: 'vjs-ads-container',
	      dir: 'ltr'
	    });
	}
}

AdsUI.prototype.options_ = {
  children: [
    'adInfoContainer',
    'adTimelineContainer',
    'adPreSkip'
  ]
};

Component.registerComponent('AdsUI', AdsUI);
