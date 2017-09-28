import {
	bisector
} from 'd3';

var bisect = bisector(function(d) {
	return d.year;
});

export const interpolateValues = (array, year, target) => {
	var i = bisect.left(array, year, 0, array.length - 1);
	var a = array[i];
	if (i > 0) {
		var b = array[i - 1];
		var t = (year - a.year) / (b.year - a.year);
		return {
			year: year,
			[target]: a[target] * (1 - t) + b[target] * t
		};
	}
	return {
		year: a.year,
		[target]: a[target]
	};
};