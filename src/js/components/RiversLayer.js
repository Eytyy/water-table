import * as d3 from 'd3';
import { interpolateValues } from '../helpers/helpers';

import rivers from '../../data/rivers';

const  RiversLayer = (props) => {
	const { svg, activeIndex, currentYear, margin, width, height } = props;

	function generateSineData(){
		return d3.range(0, 320).map(i => Math.sin(i));
	}

	function generateCosData(){
		return d3.range(0, 320).map(i => Math.cos(i));
	}

	const data = generateSineData();
	const data2 = generateCosData();
	
	const drawRiver = (selection, id, year, index) => {
		const riverData = rivers[id];
		const interpolated = interpolateValues(riverData.values, year, 'flow');
		const flow = interpolated.flow;
		const period = flow < 3 ? 3 : flow;
		const samples = Math.PI * period;
	
		const xScale = d3.scaleLinear()
			.domain([0, samples-1])
			.range([0, width]);
		
		const yScale = d3.scaleLinear()
			.domain([-1, 1])
			.range([height, 0]);

		const drawWave = d3.line()
			.x((d, i) => {
				return xScale(i - activeIndex);
			})
			.y(d => {
				const value = flow ? yScale(d) / 10 : 0;
				return value;
			})
			.curve(d3.curveBasis);

		selection
			.style('fill', 'none')
			.style('stroke', 'white')
			.style('stroke-width', '2')
			.style('stroke-opacity', '0.6')
			.attr('transform', d => {
				return `translate(0, ${(height/2) - (id * 10)})`;
			})
			.transition()
			.duration(3000)
			.ease(d3.easeLinear)
			.attr('d', drawWave);
	};
	
	// UI HELPERS
	const render = (year = currentYear, index = activeIndex) => {
		const jordanRiver = svg.selectAll('.line')
			.data([data]);
		
		jordanRiver.exit().remove();

		let jordanRiverEnter = jordanRiver.enter()
			.append('path')
			.attr('class', 'line');

		jordanRiverEnter = jordanRiverEnter.merge(jordanRiver);
		
		jordanRiverEnter
			.call(drawRiver, 0, year, index);
		
		const YarmoukRiver = svg.selectAll('.line2')
			.data([data2]);
			
		YarmoukRiver.exit().remove();
		
		let YarmoukRiverEnter = YarmoukRiver.enter()
			.append('path')
			.attr('transform', 'translate(0, -10)')
			.attr('class', 'line2');

		YarmoukRiverEnter = YarmoukRiverEnter.merge(YarmoukRiver);

		YarmoukRiverEnter
			.call(drawRiver, 1, year, index);

		const azraq = svg.selectAll('.line3')
			.data([data]);
			
		azraq.exit().remove();
		
		let azraqEnter = azraq.enter()
			.append('path')
			.attr('transform', 'translate(0, -20)')
			.attr('class', 'line3');

		azraqEnter = azraqEnter.merge(azraq);

		azraqEnter
			.call(drawRiver, 2, year, index);
			
	};
	render();
	return render;
};

export default RiversLayer;