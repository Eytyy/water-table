const VideoComponent = (props, onVideoStartedPlaying, resumeAfterSeek, onVideoEnded) => {
	
	// ID
	const ID = 'video';
	[1960, 1970, 1980, 1990, 2000, 2020]
	const config = {
		'1960': 40,
		'1970': 80,
		'1980': 120,
		'1990': 160,
		'2000': 200,
		'2010': 240,
	};

	const DOM = {
		container: null,
		video: null,
	};

	// Template
	const template = '<video id="map-video" src="./video.mp4" preload />';
	
	DOM.container = document.getElementById('video');
	DOM.container.innerHTML = template;
	
	DOM.video = document.getElementById('map-video');
	
	DOM.video.addEventListener('playing', (e) => {
		if(e.target.currentTime === 0) {
			onVideoStartedPlaying(e.target.currentTime);
		}
	});
	
	DOM.video.addEventListener('ended', () => {
		onVideoEnded();
	});

	// Event Handlers
	function toggleVisibility(visible) {
		if (visible) {
			DOM.container.classList.add('visible')
		} else {
			DOM.container.classList.remove('visible');
		}
	}

	function seekVideo(point) {
		// fast forward effect ... not working
		DOM.video.currentTime = config[point];

		// play if not playing
		if (DOM.video.ended) {
			DOM.video.play();
		}

		resumeAfterSeek();
	}

	function start() {
		console.log('start from video');
		const timeout = () => {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					toggleVisibility(true);
					resolve();
				}, 250);
			});
		}
		timeout().then(() => {
			DOM.video.play();
		});
	}

	function terminate() {
		DOM.video.currentTime = 0;
		DOM.video.pause();
	}

	const update = (action, state, year = 1960) => {
		switch(action) {
			case 'reset':
				DOM.video.currentTime = 0;
			case 'start':
				start(state);
				break;
			case 'toggle-screen':
				toggleVisibility(state.activeScreen === ID);
				break;
			case 'seek-video':
				seekVideo(year);
				break;
			case 'timer-progress':
				// console.log('video year');
				break;
			case 'tour-ended':
				terminate();
				break;
			default:
				return;
		}
	};

	return update;
};

export default VideoComponent;