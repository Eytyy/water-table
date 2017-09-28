import * as d3 from 'd3';
import { interpolateValues } from '../../helpers/helpers';

import rivers from '../../../data/rivers';

const  PopulationLayer = ({ year, svg, config  }) => {
	
	function generateSineData(){
		return d3.range(0, 1000).map(function(i){
			return Math.sin(i);
		});
	}

	const xScale = d3.scaleLinear()
		.domain([1940, 2100])
		.range([0, config.width]);

	const data = generateSineData();
	
	const drawRiver = (selection) => {
		const wave = (values) => {
			const interpolated = interpolateValues(values, year, 'flow');
			const flow = interpolated.flow < 3 ? 30 : interpolated.flow;
			const frequency = Math.PI * flow;
			
			const xScale = d3.scaleLinear()
				.domain([0, frequency - 1])
				.range([0, config.width]);
	
			const yScale = d3.scaleLinear()
				.domain([-2, 3])
				.range([config.height, 0]);
	
			const line = d3.line()
				.x((d, i) => xScale(i))
				.y(d => {
					return yScale(d);
				})
				.curve(d3.curveBasis);
		
			return line(data);
		};

		selection
			.attr('d', d => wave(d.values))
			.style('fill', 'none')
			.style('stroke', 'white')
			.style('stroke-width', '2px');
	};
	
	// UI HELPERS
	const render = () => {
		const line = svg.selectAll('.line')
			.data(rivers);
		
		line.exit().remove();

		let lineEnter = line.enter()
			.append('path')
			.attr('class', 'line')
			.data(rivers);

		lineEnter = lineEnter.merge(line);

		lineEnter
			.transition()
			.duration(3000)
			.ease(d3.easeLinear)
			.call(drawRiver)
			.duration(3000);
	};


	render();
};

export default PopulationLayer;