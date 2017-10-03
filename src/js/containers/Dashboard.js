import DashboardAnimation from './DashboardAnimation';
import DashboardText from './DashboardText';

const Dashboard = (props) => {
  const ID = 'dashboard';
  const DashboardAnimationComponent = DashboardAnimation(props);
  
  let state = {
    visible: false,
  };

  const DOM = {
		container: null,
    text: null,
    animation: null,
  };
    	
	DOM.container = document.querySelector('.dashboard');
  DOM.text = document.querySelector('.dashboard__text');
  DOM.animation = document.querySelector('.dashboard__animation');
  
  const DashboardTextComponent = DashboardText(state);

  function hide() {
    DOM.container.classList.remove('visible');
  }

  function show() {
    DOM.container.classList.add('visible');
  };
  
  function render(action, state, opts) {
    DashboardTextComponent(state.currentYear, DOM.text)
    DashboardAnimationComponent(action, state, opts);
  }

  function toggleMode() {
    const mode = state.activeScreen === 'dataviz' ? hide : show;
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
      case 'outro-started':
        hide();
        render(action, state, opts);
        break;
      case 'intro-started':
        hide();
        break;
			default:
				return;
		}
  };

  return update;
};

export default Dashboard;
