const VideoComponent = (props, onVideoStartedPlaying) => {
	
	// ID
	const ID = 'video';
	[1960, 1970, 1980, 1990, 2000, 2020]
	const config = {
		'1960': '0',
		'1970': '1',
		'1980': '2',
		'1990': '3',
		'2000': '4',
		'2020': '4.4',
		ticks: 50, // number of frames during fast-forward
		frames: 10, // number of milliseconds between frames in fast-forward
	};

	const DOM = {
		container: null,
		video: null,
	};

	// Template
	const template = '<video id="map-video" src="./video.mp4" controls preload autoplay   />';
	
	DOM.container = document.getElementById('video');
	DOM.container.innerHTML = template;
	
	DOM.video = document.getElementById('map-video');
	
	// LISTEN TO VIDEO EVENTS
	DOM.video.addEventListener('playing', (e) => {
		onVideoStartedPlaying(e.target.currentTime);
	});
	DOM.video.addEventListener('progress', () => {
		// console.log(video.currentTime);
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
		const ticks = 50;
		const frms = 10;
		const to = config[point] * 60;
		const tdelta = (to - DOM.video.currentTime)/ticks; 
		const startTime = DOM.video.currentTime;
		for ( var i = 0; i < ticks; ++i ){
			(function(j){
				setTimeout(function() {
					DOM.video.currentTime = startTime+tdelta * j;
				}, j * frms);
		 	})(i);
		}
		// play if not playing
		if (DOM.video.ended) {
			DOM.video.play();
		}
	}

	const update = (action, state, year = 1960) => {
		
		switch(action) {
			case 'toggle-screen':
				toggleVisibility(state.activeScreen === ID);
				break;
			case 'seek-video':
				seekVideo(year);
				break;
			case 'timer-progress':
				// console.log('video year');
				break;
			default:
				return;
		}
	};

	return update;
};

export default VideoComponent;