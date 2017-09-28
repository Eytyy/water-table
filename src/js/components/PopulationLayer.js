import * as d3 from 'd3';

import population from '../../data/population';

import { interpolateData, constructCirclesData } from '../helpers/helpers.population';

const  PopulationLayer = (props) => {
	const { currentYear, svg, margin, width, height  } = props;
	// Population Scales
	const xScale = d3.scaleLinear()
		.domain([1950, 2100])
		.range([0, width]);

	const yScale = d3.scaleLinear()
		.domain([
			d3.min(population, d => d.population),
			d3.max(population, d => d.population)
		])
		.range([height, 0])
		.nice();

	const rScale = d3.scaleSqrt()
		.domain([0, 2e+6])
		.range([0, 20]);
	
	// UI HELPERS
	const setCirclePosition = (selection) => {
		selection
			.attr('cx', (d, i) => {
				return d3.randomUniform(rScale(d.population) * -1, 0)() * 10;
			})
			.attr('cy', (d, i) => {
				return d3.randomUniform(0, rScale(d.population))() * 2;
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

	const render = (year) => {
		const atom = svg.selectAll('.atom')
			.data(interpolateData(year, population));
	
		atom.exit().remove();

		let atomEnter = atom
			.enter()
			.append('g')
			.attr('class', 'atom')
			.attr('transform', d => {
				return `translate(${xScale(d.year)}, ${yScale(d.population/8)})`;
			});
	
		atomEnter = atomEnter.merge(atom);
	
		const electron = atomEnter.selectAll('.electron')
			.data(constructCirclesData);
	
		electron.exit().remove();
	
		let electronEnter = electron.enter()
			.append('circle')
			.attr('class', 'electron')
			.call(setCirclePosition)
			.style('fill', '#FFF')
			.call(setCircleRadius);
		
		electronEnter = electronEnter.merge(electron);

		atomEnter
			.transition()
			.duration(1000)
			.ease(d3.easeLinear)
			.attr('transform', d => {
				return `translate(${xScale(d.year)}, ${yScale(d.population/8)})`;
			});

		electronEnter
			.transition()
			.duration(100)
			.ease(d3.easeCircle)
			.call(setCirclePosition)
			.duration(1000)
			.ease(d3.easeBackOut)
			.call(setCircleRadius);
	};
	render();
	return render;
};

export default PopulationLayer;