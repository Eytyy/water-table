import Styles from '../styles/main.scss';

import { interval } from 'd3';
import io from 'socket.io-client';

import Video from './containers/Video';
import Dashboard from './containers/Dashboard';
import SVG from './containers/SVG';
import Text from './containers/Text';
import ConfigComp from './containers/ConfigComp';

/* Initial Declarations */

let state = { // App State
	startYear: 1960,
	endYear: 2100,
	currentYear: 1960,
	activeIndex: 0,
	activeScreen: 'video',
	startVisualization: false,
	introLength: 30000,
	timerSpeed: 4000,
	introPlaying: false,
	activePhase: null,
};

let timer; // timer reference variable

const phases = [1960, 1970, 1980, 1990, 2000, 2020]; // Video Time Stops


const initSocketio = () => { // Setup Socket.io
	const ip = '192.168.1.7';
	const port = '3000';
	const socket = io.connect(`http://${ip}:${port}`);

	socket.on('connect', function() {
		socket.emit('join', 'Hello World from Water Table');
	});


	socket.on('controller', function(message) {
		const { event, payload } = message;
		console.log(message);
		switch(event) {
			case 'seek-video':
				onSeekVideo(payload);
				break;
			case 'toggle-screen':
				onToggleScreen();
				break;
			case 'toggle-svg':
				onToggleSVG(payload);
				break;
			case 'resize-dashboard':
				onResize();
				break;
			default:
				return;
		}
	});

	return socket;
};
const socket = initSocketio();

const updateState = (action, newState, opts) => { // Render Child Components on Update
	state = {
		...state,
		...newState
	};
	render(action, opts);
};
/* End Initial Declarations */


/* Event Hanlders */
const onVideoStartedPlaying =(time) => {
	// Check if starting at the begining (intro), or after
	// if after just kick-off the timed updates again
	if (!(time < 30)) {
		console.log('called dynamic update from videoStartedplaying, after intro');
		state.timerActive = true;
		dynamicUpdates();
		return;
	}

	// if not then play intro first, and once done resume timed updates
	if (state.activePhase ) {
		playIntro().then(() => {
			console.log('called dynamic update from videoStartedplaying, from intro');
			updateState('intro-ended', {});
			dynamicUpdates();
		});
	} else {
		console.log('fuck')
		updateState('intro-ended', {});
	}

};

let lastSeekPosition = null;
let prevUpdateValue = null;
let nextUpdateValue = 0;

const onSeekVideo = (position) => {
	if (
		lastSeekPosition === position ||
		lastSeekPosition === position - 1 ||
		lastSeekPosition === position + 1
	) {
		return;
	}

	lastSeekPosition = position;
	nextUpdateValue = Math.floor(position/3);
	if (nextUpdateValue === prevUpdateValue) {
		return;
	}
	console.log(nextUpdateValue);
	prevUpdateValue = nextUpdateValue;
	stopTimer();
	state.activeIndex = 0;
	state.currentYear = phases[nextUpdateValue];
	state.activePhase = phases[nextUpdateValue];
	updateState('seek-video', state, state.currentYear);
};

const onToggleScreen = () => {
	updateState('toggle-screen', {
		activeScreen: state.activeScreen === 'video' ? 'dataviz' : 'video',
	});
};

const onResize = () => {
	updateState('resize-dashboard');
};

const onToggleSVG = (position) => {
	updateState('toggle-svg', state, position);
};
/* End Event Hanlders */


/* Main Functions */
const stopTimer = () => {
	console.log('stop');
	clearInterval(timer);
};

// Plays intro when video starts playing, called by onVideoStartedPlaying()
const playIntro = () => {
	updateState('intro-started', {});
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, state.introLength);
	});
}

let du = 0;

const dynamicUpdates = () => {
	console.log(`dynamic up callstack ${du}`);
	du++;
	state.timerSpeed = state.currentYear === 2020 ? 375 : 4000;
	timer = setInterval(() => {
		updateState('timer-progress', {
			startVisualization: true,
			currentYear: state.currentYear + 1,
			activeIndex: state.activeIndex + 1,
		}, state.currentYear);

		if (state.currentYear === 2020 && state.timerSpeed !== 375) {
			stopTimer();
			state.timerSpeed = 375;
			console.log('called dynamic update from within dynamic updates because year 2020');
			dynamicUpdates();
		}
		if (state.currentYear === 2100) {
			stopTimer();
		}
	}, state.timerSpeed);
};
/* End Main Functions */


// Initialize Child Components
const DashboardComponent = Dashboard(state);
const VideoComponent = Video(state, onVideoStartedPlaying);
const SVGComponent = SVG(state);
const TextComponent = Text(state);
const ConfigComponent = ConfigComp(state);

// Render Child Components
function render(action, opts) {
	VideoComponent(action, state, opts);
	SVGComponent(action, state, opts)
	DashboardComponent(action, state, opts)
	ConfigComponent(state);
}





