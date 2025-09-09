import videojs from 'video.js';

import './AdTimeline.js';

const Component = videojs.getComponent('Component');

export default class AdTimelineContainer extends Component {

	createEl() {
		return super.createEl('div', {
	      className: 'vjs-ads-timeline-container'
	    });
	}
}

AdTimelineContainer.prototype.options_ = {
  children: [
    'adTimeline'
  ]
};

Component.registerComponent('adTimelineContainer', AdTimelineContainer);
