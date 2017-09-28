import * as d3 from 'd3';

const SineWave = ({ svg, config }) => {
	const data = d3.range(0, 100).map(d => Math.sin(d));
	
	// samples:
	// 20 flow max
	// 6 flow weak
	// 3 flow ppor

	// yScale(0) for dead
	// update x value to move wave	
	const samples = Math.PI * 3;
	const xScale = d3.scaleLinear()
		.domain([0, samples-1])
		.range([0, config.width]);

	const yScale = d3.scaleLinear()
		.domain([-3, 3])
		.range([config.height, 0]);

	const lineGen = d3.line()
		.x((d, i) => {
			return xScale(i);
		})
		.y(d => {
			return yScale(d);
		})
		.curve(d3.curveBasis);

	const line = svg.selectAll('.line')
		.data([data]);
	
	line.enter()
		.append('path')
		.attr('class', 'line')
		.attr('d', lineGen)
		.style('stroke', '#FFF')
		.style('stroke-width', 2)
		.style('fill', 'none');
};

export default SineWave;