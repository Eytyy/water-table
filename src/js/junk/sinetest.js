
const w = 960;
const h = 500;
const start = Date.now();

const lines = [];

var n = 1;
var m = 70;

for (let i in d3.range(n)) {
	
	var speed = (i - 2) * 1e-2;
	
	var data = d3.range(m);
	
	lines.push({ 
		width: 5, 
		height: 15,
		speed: speed,
		index: i,
		data: data
	});
}

const xscale = d3.scale.linear()
	.domain([0,m])
	.range([0, w]);

const omega = -.22;
function line_maker( data, speed ) {
	var freq = Math.PI*.4 + 3 * omega * data.index; // * 3000
	var svgline = d3.svg.line()
		.x(function(d) {
			return xscale(d);
		})
		.y(function(d) {
			var theta = freq * d/m * Math.PI * 4;
			//console.log("sin", Math.sin(theta), d)
			var y = data.height * (Math.sin(theta + (n-data.index) * .1 * speed * .18 ));
			//console.log ("y", y)
			return y;
		})
		.interpolate("basis");
		return svgline(data.data);
}

const spacing = 26;

function lineEnter(d, i) {
	d3.select(this).selectAll('.path')
		.data([d])
		.enter()
		.append('path')
		.attr('class', function(d) {
			return `path path-${d.index}`;
		})
		.attr('d', function(d) {
			return line_maker(d, 0);
		})
		.attr('stroke-width', function(e,i) { return e.width;})
		.attr('stroke', "#fff")
		.attr("fill", "none")

	update_spacing();
}

const svg = d3.select('svg')
	.attr('width', w)
	.attr('height', h)
	.append('g');

let line = svg.selectAll('g.line')
	.data(lines)
	.enter().append('g')
	.attr('class', 'line')
	.each(lineEnter);


const sm = .39 ;
function update_spacing() {
	const th = spacing * n;
	const hscale = d3.scale.linear()
		.domain([0, n])
		.range([0, h]);

	d3.selectAll("g.line path")
		.attr("transform", function(d, i) { 
			//console.log("h",h, spacing, d.index);
			//return "translate(" + [0, th - spacing * d.index] + ")"; 
			return "translate(" + [0, h/2 + th / 2 - spacing * d.index] + ")"; 
		});
}

var color = d3.scale.linear()
	.domain([-1, 1])
	.interpolate(d3.interpolateRgb)
	.range(['#fff', '#000']);

var opacity = d3.scale.linear()
	.domain([0, n])
	.range([1, .4]);


d3.timer(function() {
var elapsed = Date.now() - start

line = d3.selectAll("g.line path")
	.attr("d", function(d) {
		var speed = sm * .08 * elapsed + d.index * 5;
		return line_maker( d, speed );
	})
	.attr("stroke-opacity", function(d) { return opacity(d.index);})
		

});