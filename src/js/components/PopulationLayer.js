import * as d3 from 'd3';

import population from '../../data/population';

import { interpolateData, constructCirclesData } from '../helpers/helpers.population';

const  PopulationLayer = (props, isdashboard) => {
	const { currentYear, svg, margin, width, height  } = props;
	const maxradius = isdashboard ? 5 : 35;
	// Population Scales
	const xScale = d3.scaleLinear()
		.domain([1950, 2100])
		.range([0, width]);

	const yScale = d3.scaleLinear()
		.domain([
			d3.min(population, d => d.population),
			d3.max(population, d => d.population)
		])
		.range([1000, 0])
		.nice();

	const rScale = d3.scaleSqrt()
		.domain([0, 1e+5])
		.range([0, maxradius]);

	// UI HELPERS
	const setCirclePosition = (selection) => {
		let xminoffset = isdashboard ? -2 : -4;
		let xmaxoffset = isdashboard ? 2 : 4;
		let yminoffset = isdashboard ? -2 : -4;
		let ymaxoffset = isdashboard ? 2 : 4;

		selection
			.attr('cx', (d, i) => {
				return width/2 + (i/4 * d3.randomUniform(xminoffset, xmaxoffset)());
			})
			.attr('cy', (d, i) => {
				return height/2 + (i/4 * d3.randomUniform(yminoffset, ymaxoffset)());
			});
	};

	const setCircleRadius = (selection) => {
		selection
			.attr('r', (d, i) => {
				const m = Math.abs(d.population - (i * d.population/2));
				const radius = rScale(m);
				return radius;
			});
	};
	
	const appendText = (selection) => {
		if (!isdashboard) {
			return;
		}
		selection
			.append('text')
			.text('population')
			.attr('class', 'dashboard-label')
			.attr('font-size', '18')
			.attr('y', '220')
			.attr('fill', '#FFF')
	};

	const render = (year = currentYear) => {
		const intd = interpolateData(year, population)[0];
		const atom = svg.selectAll('.atom')
			.data(interpolateData(year, population));
	
		atom.exit().remove();

		let atomEnter = atom
			.enter()
			.append('g')
			.attr('class', 'atom')
			.attr('transform', () => {
				const value = isdashboard ? -200 : -150;
				return `translate(0, ${value})`;
			});
		
		const label = atomEnter
			.call(appendText);
	
		atomEnter = atomEnter.merge(atom);
	
		const electron = atomEnter.selectAll('.electron')
			.data(constructCirclesData);
	
		electron.exit().remove();
	
		let electronEnter = electron.enter()
			.append('circle')
			.attr('class', 'electron')
			.call(setCirclePosition)
			.style('fill', '#FFF')
			.style('fill-opacity', '0.6')
			.call(setCircleRadius);
		
		electronEnter = electronEnter.merge(electron);

		electronEnter
			.transition()
			.duration(2000)
			.ease(d3.easeLinear)
			.call(setCirclePosition)
			.call(setCircleRadius);
	};
	render();
	return render;
};

export default PopulationLayer;