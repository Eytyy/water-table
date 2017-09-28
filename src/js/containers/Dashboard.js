import Animation from './Animation';
import DashboardText from './DashboardText';

const Dashboard = (props) => {
  const ID = 'dashboard';
  const AnimationComponent = Animation(props);
  
  let state = {
    visible: false,
  };

  const DOM = {
		container: null,
    text: null,
    animations: null,
  };
    	
	DOM.container = document.getElementById('dashboard');
  DOM.text = document.querySelector('.dashboard-text');
  DOM.animations = document.querySelector('.dashboard-animations');
  
  const DashboardTextComponent = DashboardText(state);

  function hide() {
    DOM.container.classList.remove('visible');
  }

  function show() {
    DOM.container.classList.add('visible');
  };
  
  function render(action, state, opts) {
    DashboardTextComponent(state.currentYear, DOM.text)
    AnimationComponent(action, state, opts);
  }

  function toggleMode() {
    const mode = state.activeScreen === 'dataviz' ? hide : show;
    const tout = setTimeout(() => {
      mode();
    }, 1000);
  }

  const update = (action, newState, opts) => {
    state = {
			...state,
			...newState
    };
		switch(action) {
      case 'toggle-screen':
      case 'intro-ended':
        render(action, state, opts);
				toggleMode();
        break;
      case 'seek-video':
      case 'timer-progress':
      case 'reset':
        render(action, state, opts);
        break;    
      case 'outro-started':
        hide();
        render(action, state, opts);
        break;
			default:
				return;
		}
  };

  return update;
};

export default Dashboard;
