import videojs from 'video.js';

import './AdTime.js';

const Component = videojs.getComponent('Component');
//import './AdSlotsRemaining';
//import './AdLink.js';

export default class AdInfoContainer extends Component {

	createEl() {
		return super.createEl('div', {
	      className: 'vjs-ads-info-container'
	    });
	}

	handleClick(event) {
		//vast ad click tracker
		if (this.player_.tracker) {
			this.player_.tracker.click();
		}
	}


}

AdInfoContainer.prototype.options_ = {
  children: [
  	'adTime',
    //'adSlotsRemaining'
  ]
};

Component.registerComponent('adInfoContainer', AdInfoContainer);
