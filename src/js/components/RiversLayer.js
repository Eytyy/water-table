import * as d3 from 'd3';
import { interpolateValues } from '../helpers/helpers';

import rivers from '../../data/rivers';

const  RiversLayer = (props, isdashboard) => {
	const { svg, activeIndex, currentYear, margin, width, height } = props;
	const m = 100;
	const azraqShift = 40;
	const jordanShift = -40;

	function generateSineData(){
		return d3.range(0, m).map(i => i);
	}

	const data = generateSineData();
	
	const drawRiver = (selection, id, year, index) => {
		const riverData = rivers[id];
		const interpolated = interpolateValues(riverData.values, year, 'flow');
		const flow = interpolated.flow;
		
		const xScale = d3.scaleLinear()
			.domain([0, m])
			.range([0, width + 20]);
		
		const yScale = d3.scaleLinear()
			.domain([-2, 2])
			.range([height, 0]);

		const drawWave = d3.line()
			.x((d, i) => {
				return xScale(d);
			})
			.y(d => {
				var theta = d/m * Math.PI * 4;
				var speed = .08 * index * 5;
				return yScale(Math.sin(theta + index) * .1 - flow);
			});

		selection
			.style('fill', 'none')
			.style('fill-opacity', '0.5')
			.style('stroke', '#FFF')
			.transition()
			.duration(4000)
			.ease(d3.easeLinear)
			.attr('d', drawWave);
	};

	const appendText = (selection) => {
		if (!isdashboard) {
			return;
		}
		selection
			.append('text')
			.text('rivers')
			.attr('class', 'dashboard-label')
			.attr('font-size', '18')
			.attr('y', '200')
			.attr('fill', '#FFF')
	};
	
	// UI HELPERS
	const render = (year = currentYear, index = activeIndex) => {
		// Jordan river

		const rivers = svg.selectAll('.rivers')
			.data([data]);
		
		rivers.exit().remove();

		let riversEnter = rivers
			.enter()
			.append('g')
			.attr('class', 'rivers');

		const label = riversEnter
			.call(appendText);

		riversEnter = riversEnter.merge(rivers);

		const jordanRiver = riversEnter.selectAll('.line')
			.data([data]);
		
		jordanRiver.exit().remove();

		let jordanRiverEnter = jordanRiver.enter()
			.append('path')
			.attr('transform', `translate(-2, ${jordanShift})`)
			.attr('class', 'line');

		jordanRiverEnter = jordanRiverEnter.merge(jordanRiver);
		
		jordanRiverEnter
			.style('stroke-width', '8')
			.call(drawRiver, 0, year, index);
		
		// Yarmouk River
		const YarmoukRiver = riversEnter.selectAll('.line2')
			.data([data]);
			
		YarmoukRiver.exit().remove();
		
		let YarmoukRiverEnter = YarmoukRiver.enter()
			.append('path')
			.attr('transform', 'translate(-2, 0)')
			.attr('class', 'line2');

		YarmoukRiverEnter = YarmoukRiverEnter.merge(YarmoukRiver);

		YarmoukRiverEnter
			.style('stroke-width', '6')
			.call(drawRiver, 1, year, index);

		// Azraq River
		const azraq = riversEnter.selectAll('.line3')
			.data([data]);
			
		azraq.exit().remove();
		
		let azraqEnter = azraq.enter()
			.append('path')
			.attr('transform', `translate(-2, ${azraqShift})`)
			.attr('class', 'line3');

		azraqEnter = azraqEnter.merge(azraq);

		azraqEnter
			.style('stroke-width', '4')
			.call(drawRiver, 2, year, index);
			
	};
	render();
	return render;
};

export default RiversLayer;