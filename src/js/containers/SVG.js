/* SVG overlays: topography and info */

import topography from '../svgs/topography.svg';
import info from '../svgs/info.svg';

const SVG = () => {
  const ID = 'svgs';

  let state = {
    visible: false,
  };

  const DOM = {
		container: null,
    info: null,
    topography: null,
  };

  const template = `
    <div class="info__screen topography" style="background-image:url('${topography}')"></div>
    <div class="info__screen info" style="background-image:url('${info}')"></div>
  `;
  	
	DOM.container = document.getElementById('info');
  DOM.container.innerHTML = template;
  DOM.topography = document.querySelector('.topography');
  DOM.info = document.querySelector('.info');
  
  // refactor for rotary instead of buttons: 0 1 2 off 1 2
  function toggleVisibility(position) {
    if (state.activeScreen !== 'video') {
      if (state.visible) {
        state.visible = false;
        DOM.container.classList.remove('visible')
      }
      return;
    }

    if (!position) {
      state.visible = false;
      DOM.container.classList.remove('visible')
      return;
    }
    
    
    if (position === 1) {
      DOM.topography.classList.add('visible');
      DOM.info.classList.remove('visible');
    } else if (position === 2) {
      DOM.topography.classList.remove('visible');
      DOM.info.classList.add('visible');
    }
    DOM.container.classList.add('visible')
    state.visible = !state.visible;
  }

  const update = (action, newState, payload) => {
    state = {
			...state,
			...newState
		};
		switch(action) {
			case 'toggle-svg':
				toggleVisibility(payload);
        break;
      case 'toggle-screen':
				toggleVisibility(payload);
				break;
			default:
				return;
		}
  };

  return update;
};

export default SVG;
