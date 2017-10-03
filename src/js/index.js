import Styles from '../styles/main.scss';

import { interval } from 'd3';
import io from 'socket.io-client';

import Video from './containers/Video';
import Timeline from './containers/Timeline';
import Dashboard from './containers/Dashboard';
import SVG from './containers/SVG';
import Text from './containers/Text';
import Messages from './containers/Messages';
import Data from './containers/Data';
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
	// const ip = '10.152.98.106';
	// const ip = '192.168.1.2';
	// const ip = '192.168.1.4';
	const ip = '192.168.1.3';
	const port = '3000';
	const socket = io.connect(`http://${ip}:${port}`);

	socket.on('connect', function() {
		socket.emit('join', 'Hello World from Water Table');
	});

	socket.on('controller', function(message) {
		const { event, payload } = message;
		// if (state.isOutroActive) {
		// 	sendInterfaceMessage('wait for outro to finish.');
		// 	return false;
		// }
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
			case 'svg-1':
				onToggleSVG(1);
				break;
			case 'svg-2':
				onToggleSVG(2);
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
	setState(newState);
	render(action, opts);
	resetInterfaceMessage();
};
const MessageComponent = Messages();

const sendInterfaceMessage = (msg) => {
	MessageComponent(msg);
};

const resetInterfaceMessage = () => {
	MessageComponent('');
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

let introCount;

const startIntroCount = () => {
	clearInterval(introCount);
	updateState('intro-started', {
		isIntroActive: true
	});
	return new Promise((resolve, reject) => {
		introCount = setTimeout(() => {
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
	if (lastSeekPosition === position || lastSeekPosition === position - 1 || lastSeekPosition === position + 1) return;

	lastSeekPosition = position;
	nextUpdateValue = Math.floor(position/3);

	if (nextUpdateValue === prevUpdateValue) return;

	if (state.isIntroActive) {
		sendInterfaceMessage('wait for intro to finish');
		return false;
	} else if (state.isOutroActive) {
		sendInterfaceMessage('wait for outro to finish.');
		return false;
	} else if (state.isIdle) {
		sendInterfaceMessage('press start.');
		return false;
	}

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

const onVideoProgress = (time) => {
	updateState('video-progress', state, time);
};

const onToggleScreen = () => {
	if (state.isIdle) {
		return false;
	} else if (state.isIntroActive) {
		sendInterfaceMessage('wait for intro to finish');
		return false;
	}	else if (state.isOutroActive) {
		sendInterfaceMessage('wait for outro to finish.');
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
	if (state.isIntroActive) {
		sendInterfaceMessage('wait for intro to finish');
		return false;
	} else if (state.isOutroActive) {
		sendInterfaceMessage('press start or wait for outro to finish.');
		return false;
	} else if (state.isIdle) {
		sendInterfaceMessage('press start to start again');
		return false;
	}
	updateState('toggle-svg', state, position);
};
/* End Event Hanlders */

/* Main Functions */
const stopTimer = () => {
	clearInterval(timer);
};

let du = 0;

const dynamicUpdates = () => {
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
		if (state.currentYear === 2101) {
			console.log('trigger-outro');
			triggerOutroState();
		}
	}, state.timerSpeed);
};
/* End Main Functions */

// Initialize Child Components
const TimelineComponent = Timeline(state);
const VideoComponent = Video(state, onVideoStartedPlaying, resumeAfterSeek, onVideoEnded, onVideoProgress);
const DashboardComponent = Dashboard(state);
const DataComponent = Data(state);
const SVGComponent = SVG(state);
const TextComponent = Text(state);
// const ConfigComponent = ConfigComp(state);

const reset = () => {
	updateState('reset', defaultState);
	start();
};

const start = () => {
	// start again
	if (!state.isIdle) {
		// if (state.isOutroActive) {
		// }
		stopTimer();
		reset();
		return;
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
	DataComponent(action, state, opts);
}





