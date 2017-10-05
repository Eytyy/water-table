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
const dataLayers = ['all', 'rivers', 'population'];

const initSocketio = () => { // Setup Socket.io
	// const ip = '192.168.14.64';
	const ip = '192.168.1.32';
	// const ip = '192.168.1.3';
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
			case 'change-data-layer':
				onChangeDataLayer(payload);
				break;
			case 'svg-1':
				onToggleSVG(1);
				break;
			case 'svg-2':
				onToggleSVG(2);
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

const updateState = (action, newState = state, opts = {}) => { // Render Child Components on Update\
	setState(newState);
	render(action, opts);
	resetInterfaceMessage();
};
const MessageComponent = Messages();

const sendInterfaceMessage = (msg) => {
	MessageComponent(msg);
	updateController('interface-message', {
		message: msg,
	});};

const resetInterfaceMessage = () => {
	MessageComponent('');
};

const updateController = (event, payload) => {
	socket.emit('from-table', {
		event,
		payload,
	});
};

/* End Initial Declarations */


/* Event Hanlders */

const onVideoEnded = () => {
	updateController('tour-ended', defaultState);
	updateState('tour-ended', defaultState);
};

const onVideoStartedPlaying =() => {
	startIntroCount().then(() => {
		updateController('intro-ended', {
			isIntroActive: false,
			isTableActive: true,
		});
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
	updateController('intro-started', {
		isIntroActive: true
	});
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
	updateController('outro-started', {
		isOutroActive: true,
		isTableActive: false,
		startYear: 1960,
		endYear: 2100,
		currentYear: 1960,
		isIdle: true,
		activeIndex: 0,
	});
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

const onSeekVideo = (position) => {
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

	stopTimer();
	state.activeIndex = 0;
	state.currentYear = phases[position];
	state.activePhase = phases[position];
	
	updateState('seek-video', state, state.currentYear);
};

const resumeAfterSeek = () => {
	dynamicUpdates();
};

const onVideoProgress = (time) => {
	updateController('video-progress', {
		state,
		time,
	});
	updateState('video-progress', state, time);
};

let lastLayer = null;
let prevLayer = null;
let nextLayer = 0;

const onChangeDataLayer = (position) => {
	if (lastLayer === position || lastLayer === position - 1 || lastLayer === position + 1) return;

	lastLayer = position;
	nextLayer = Math.floor(position/3);

	if (nextLayer === prevLayer) return;

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
	
	updateController('change-data-layer', {
		state,
		nextLayer: dataLayers[nextLayer],
	});
	updateState('change-data-layer', state, dataLayers[nextLayer]);
}

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
	
	updateController('toggle-screen', {
		activeScreen: state.activeScreen === 'video' ? 'dataviz' : 'video',
	});
	updateState('toggle-screen', {
		activeScreen: state.activeScreen === 'video' ? 'dataviz' : 'video',
	});
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
	state.timerSpeed = state.currentYear === 2020 ? 350 : 4000;
	timer = setInterval(() => {
		updateController('timer-progress', {
			startVisualization: true,
			currentYear: state.currentYear + 1,
			activeIndex: state.activeIndex + 1,
		});

		updateState('timer-progress', {
			startVisualization: true,
			currentYear: state.currentYear + 1,
			activeIndex: state.activeIndex + 1,
		}, state.currentYear);

		if (state.currentYear === 2020 && state.timerSpeed !== 350) {
			stopTimer();
			state.timerSpeed = 350;
			dynamicUpdates();
		}
		if (state.currentYear === 2101) {
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
	updateController('start', {
		isIdle: false,
	});

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





