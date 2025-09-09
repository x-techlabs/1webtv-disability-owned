import videojs from 'video.js';

import './AdSkipRemaining.js';

const Component = videojs.getComponent('Component');

export default class AdPreSkip extends Component {
	
	constructor(player, options) {
		super(player, options);

		player.on('adskipremaining', (e, time) => this.onSkipRemaining(e, time));
	}

	createEl(tag = 'div', props = {}, attributes = {}) {
    	
    	this.tabIndex_ = props.tabIndex;

    	props = {
	      className: this.buildCSSClass()
	    };

    	return super.createEl(tag, props, attributes);
	}

	buildCSSClass() {
	    return 'vjs-ads-pre-skip vjs-control';
	}

	onSkipRemaining(e, time) {
		this.el().innerHTML = time;
	}
}

Component.registerComponent('adPreSkip', AdPreSkip);
