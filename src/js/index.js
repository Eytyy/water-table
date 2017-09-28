import Styles from '../styles/main.scss';

import { interval } from 'd3';
import io from 'socket.io-client';

import Video from './containers/Video';
import Timeline from './containers/Timeline';
import Dashboard from './containers/Dashboard';
import SVG from './containers/SVG';
import Text from './containers/Text';
import ConfigComp from './containers/ConfigComp';

/* Initial Declarations */

const defaultState = {
	startYear: 1960,
	endYear: 2100,
	currentYear: 1960,
	activeIndex: 0,
	activeScreen: 'video',
	isIdle: true,
	isTableActive: false,
	isIntroActive: false,
	isOutroActive: false,
	activePhase: null,
	introLength: 40000,
	timerSpeed: 4000,
};

let state = { // App State
	startYear: 1960,
	endYear: 2100,
	currentYear: 1960,
	activeIndex: 0,
	activeScreen: 'video',
	isIdle: true,
	isTableActive: false,
	isIntroActive: false,
	isOutroActive: false,
	activePhase: null,
	introLength: 40000,
	timerSpeed: 4000,
};

let timer; // timer reference variable

const phases = [1960, 1970, 1980, 1990, 2000, 2010]; // Video Time Stops

const initSocketio = () => { // Setup Socket.io
	const ip = '192.168.1.27';
	const port = '3000';
	const socket = io.connect(`http://${ip}:${port}`);

	socket.on('connect', function() {
		socket.emit('join', 'Hello World from Water Table');
	});

	socket.on('controller', function(message) {
		const { event, payload } = message;
		switch(event) {
			case 'start':
				start();
				break;
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

const setState = (newState) => {
	state = {
		...state,
		...newState
	};
};

const updateState = (action, newState = state, opts = {}) => { // Render Child Components on Update
	console.log(action);
	setState(newState);
	render(action, opts);
};
/* End Initial Declarations */


/* Event Hanlders */

const onVideoEnded = () => {
	updateState('tour-ended', defaultState);
};

const onVideoStartedPlaying =() => {
	startIntroCount().then(() => {
		updateState('intro-ended', {
			isIntroActive: false,
			isTableActive: true,
		});
		dynamicUpdates();
	});
};

const startIntroCount = () => {
	updateState('intro-started', {
		isIntroActive: true
	});
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			updateState('intro-ended', {});
			resolve();
		}, state.introLength);
	});
}

const triggerOutroState = () => {
	stopTimer();
	updateState('outro-started', {
		isOutroActive: true,
		isTableActive: false,
		startYear: 1960,
		endYear: 2100,
		currentYear: 1960,
		isIdle: true,
		activeIndex: 0,
	});
};

let lastSeekPosition = null;
let prevUpdateValue = null;
let nextUpdateValue = 0;

const onSeekVideo = (position) => {
	if (state.isIntroActive || state.isOutroActive || state.isIdle) {
		return false;
	}

	if (lastSeekPosition === position || lastSeekPosition === position - 1 || lastSeekPosition === position + 1) return;

	lastSeekPosition = position;
	nextUpdateValue = Math.floor(position/3);

	if (nextUpdateValue === prevUpdateValue) return;

	prevUpdateValue = nextUpdateValue;

	stopTimer();
	state.activeIndex = 0;
	state.currentYear = phases[nextUpdateValue];
	state.activePhase = phases[nextUpdateValue];
	
	updateState('seek-video', state, state.currentYear);
};

const resumeAfterSeek = () => {
	dynamicUpdates();
};

const onToggleScreen = () => {
	if (state.isIdle) {
		return false;
	}
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
	clearInterval(timer);
};

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
			dynamicUpdates();
		}
		if (state.currentYear === 2100) {
			triggerOutroState();
		}
	}, state.timerSpeed);
};
/* End Main Functions */

// Initialize Child Components
const TimelineComponent = Timeline(state);
const VideoComponent = Video(state, onVideoStartedPlaying, resumeAfterSeek, onVideoEnded);
const DashboardComponent = Dashboard(state);
const SVGComponent = SVG(state);
const TextComponent = Text(state);
const ConfigComponent = ConfigComp(state);

const reset = () => {
	updateState('reset', defaultState);
};

const start = () => {
	if (!state.isIdle) {
		console.log(reset);
		reset();
	}
	updateState('start', {
		isIdle: false,
	});
};

// Render Child Components
function render(action, opts) {
	TimelineComponent(action, state, opts);
	VideoComponent(action, state, opts);
	SVGComponent(action, state, opts)
	DashboardComponent(action, state, opts)
	TextComponent(action, state, opts);
	ConfigComponent(state);
}





