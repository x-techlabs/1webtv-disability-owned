import videojs from 'video.js';

const Component = videojs.getComponent('Component');

class AdSkipRemaining extends Component {

	buildCSSClass() {
	    return 'vjs-ads-skip-remaining';
	}
}

Component.registerComponent('adSkipRemaining', AdSkipRemaining);
