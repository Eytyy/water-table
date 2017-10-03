import population from '../../data/population';
import rivers from '../../data/rivers';
import { interpolateData } from '../helpers/helpers.population';
import { interpolateValues } from '../helpers/helpers';

const DataInfo = () => {
	const DOM = {
		population: null,
		jordan: null,
		yarmouk: null,
		zarqa: null
	};

	const riverFlow = (flow) => {
		let value;
		if (flow === 3 || (flow > 3 && flow < 4.5)) {
			value = 'weak';
		} else if ( flow > 4.5 && flow < 10) {
			value = 'strong';
		} else if (flow > 10) {
			value = 'very strong';
		} else {
			value = 'dry';
		}
		return value;
	};

	const container = document.querySelector('.data__dashboard');

	const template = `
		<div class="data__dashboard__population data__dashboard__item">
			<div class="data__dashboard__item__title">Population</div>
			<div class="value"></div>
		</div>
		<div class="data__dashboard__rivers data__dashboard__item">
			<div class="data__dashboard__rivers__item data__dashboard__rivers__jordan">
				<div class="data__dashboard__item__title river__name">Jordan River</div>
				<div class="river__flow"></div>
			</div>
			<div class="data__dashboard__rivers__item data__dashboard__rivers__yarmouk">
				<div class="data__dashboard__item__title river__name">Yarmouk River</div>
				<div class="river__flow"></div>
			</div>
			<div class="data__dashboard__rivers__item data__dashboard__rivers__zarqa">
				<div class="data__dashboard__item__title river__name">Zarqa River</div>
				<div class="river__flow"></div>
			</div>
		</div>
	`;
	
	container.innerHTML = template;

	DOM.population = document.querySelector('.data__dashboard__population .value');
	DOM.jordan = document.querySelector('.data__dashboard__rivers__jordan .river__flow');
	DOM.yarmouk = document.querySelector('.data__dashboard__rivers__yarmouk .river__flow');
	DOM.zarqa = document.querySelector('.data__dashboard__rivers__zarqa .river__flow');
	

	function update(action, state, year) {
		const populationData = interpolateData(year, population);
		const populationValue = Math.floor(populationData[0].population);
		DOM.population.innerText = `${populationValue}`;

		const JordanRiver = interpolateValues(rivers[0].values, year, 'flow');
		const JordanRiverValue = riverFlow(JordanRiver.flow);
		const YarmoukRiver = interpolateValues(rivers[1].values, year, 'flow');
		const YarmoukRiverValue = riverFlow(YarmoukRiver);
		const ZarqaRiver = interpolateValues(rivers[2].values, year, 'flow');
		const ZarqaRiverValue = riverFlow(ZarqaRiver);

		DOM.jordan.innerText = `${JordanRiverValue}`;
		DOM.yarmouk.innerText = `${YarmoukRiverValue}`;
		DOM.zarqa.innerText = `${ZarqaRiverValue}`;
	}

	return update;
};

export default DataInfo;