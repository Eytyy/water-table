import * as d3 from 'd3';
import PopulationLayer from '../components/PopulationLayer';
import RiversLayer from '../components/RiversLayer';

const AnimationComponent = (props) => {
	let ID = 'dataviz';
	let state = {
		shouldPlay: false,
	};
	
	const margin = { top: 0, right: 0, bottom: 0, left: 0 };
	const width = 1440 - margin.left - margin.right;
	const height = 900 - margin.top - margin.bottom;
	
	const DOM = {
		container: null,
	};

	
	DOM.container = document.getElementById('animation');

	const svg = d3.select('#dashboard-dataviz')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.call(responsivefy)
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top })`);

	function toggleVisibility(visible) {
		console.log('visiblity', visible);
	}

	// Render Layers 
	const Population = PopulationLayer({ svg, width, height, margin, ...props });
	const Rivers = RiversLayer({ svg, width, height, margin, ...props });
	
	function render(year) {
		Population(year, state.activeIndex);
		Rivers(year, state.activeIndex);
	}

	function resizeContainer() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				consooe.log('resizeContainer')
				// DOM.container.style.width = '300px';
				// DOM.container.style.height = '800px';
				resolve();
			}, 0);
		});
	}

	// Update function
	function update(action, newState, year = 1950) {
		
		// update  local state
		state = {
			...state,
			...newState
		};
		
		switch(action) {
			case 'toggle-screen':
				toggleVisibility(newState.activeScreen === ID);
				break;
			case 'seek-video':
				render(year);
				break;
			case 'timer-progress':
				render(year)
				break;
			case 'resize-dashboard':
				resizeContainer().then(() => {
					d3.select('#animation').select('svg').call(responsivefy);
				});
				break;
			default:
				return;
		}
	};

	return update;
};

function responsivefy(svg, forceResize) {
	var container = d3.select(svg.node().parentNode);
	var width = parseInt(svg.style('width'));
	var height = parseInt(svg.style('height'));
	var aspect = width / height;

	svg.attr('viewBox', '0 0 ' + width + ' ' + height)
		.attr('preserveAspectRatio', 'xMinYMid')
		.call(resize);

	d3.select(window).on('resize.' + container.attr('id'), resize);

	function resize() {
		var targetWidth = parseInt(container.style('width'));
		svg.attr('width', targetWidth);
		svg.attr('height', Math.round(targetWidth / aspect));
	}
}

export default AnimationComponent;



