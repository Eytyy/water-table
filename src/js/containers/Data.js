import Animation from './Animation';
import DataInfo from './DataInfo';

const Data = (props) => {
  const AnimationComponent = Animation(props);
  
  let state = {
		visible: false,
  };

  const DOM = {
		container: null,
		dashboard: null,
		visualization: null,
  };
		
	DOM.container = document.querySelector('.data');
  DOM.dashboard = document.querySelector('.data__dashboard');
  DOM.visualization = document.querySelector('.data__visualization');
  
  const DataInfoComponent = DataInfo(state);

  function hide() {
		DOM.container.classList.remove('visible');
  }

  function show() {
		DOM.container.classList.add('visible');
  };
  
  function render(action, state, opts) {
		DataInfoComponent(action, state, opts);
		AnimationComponent(action, state, opts);
  }

  function toggleMode() {
		const mode = state.activeScreen === 'dataviz' ? show : hide;
		mode();
  }

  const update = (action, newState, opts) => {
		state = {
			...state,
			...newState
		};
		switch(action) {
	 		case 'toggle-screen':
				toggleMode();
				break;
	  	case 'intro-ended':
				toggleMode();
				render(action, state, opts);
				break;
	  	case 'seek-video':
	  	case 'timer-progress':
	  	case 'reset':
				render(action, state, opts);
				break;
			case 'reset':
	  	case 'intro-started':
			case 'outro-started':
				render(action, state, opts);
				hide();
				break;
			case 'change-data-layer':
				if (state.activeScreen !== 'dataviz') {
					return;
				}
				render(action, state, opts);
				break;
			default:
				return;
	}
};

  return update;
};

export default Data;
