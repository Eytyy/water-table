import { interpolateValues } from './helpers';

export const interpolateData = (year, population) => {
	const data = interpolateValues(population, year, 'population');
	return [data];
};

export const constructCirclesData = (d) => {
	const numberOfBigCircles = Math.floor(d.population / 2e+6);
	const smallCirclePopulation = Math.floor(d.population%2e+6);

	function multi() {
		const data = [];
		for(let c = 0; c < numberOfBigCircles; c++) {
			data.push({
				year: d.year,
				population: 2e+6 
			});
		}
		data.push({year: d.year, population: smallCirclePopulation});
		return data;
	}
	
	switch (numberOfBigCircles) {
	case 0:
		return [d];
	case 1: 
		return [{year: d.year, population: 2e+6}, {year: d.year, population: smallCirclePopulation}];
	default:
		return multi();
	}
};