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
    <div class="info__screen info__topography" style="background-image:url('${topography}')"></div>
    <div class="info__screen info__text" style="background-image:url('${info}')"></div>
  `;
  	
	DOM.container = document.querySelector('.info');
  DOM.container.innerHTML = template;
  DOM.topography = document.querySelector('.info__topography');
  DOM.info = document.querySelector('.info__text');
  
  // refactor for rotary instead of buttons: 0 1 2 off 1 2

  // topography

  function showContainer(position) {
    DOM.container.classList.add('visible')
    state.visible = true;
    lastVisible = position;
  }

  function hideContainer() {
    DOM.container.classList.remove('visible')
    state.visible = false;
  }

  function showSvg1() {
    DOM.topography.classList.add('visible');
  }

  function hideSvg1() {
    DOM.topography.classList.remove('visible');
  }
  //info
  function showSvg2() {
    DOM.info.classList.add('visible');
  }

  function hideSvg2() {
    DOM.info.classList.remove('visible');
  }

  let lastVisible;

  function toggleVisibility(position) {
    if (state.activeScreen !== 'video') {
      if (state.visible) {
        hideContainer();
      }
      return;
    }
    if (position === 1) {
      if (DOM.topography.classList.contains('visible')) {
        hideSvg1();
      } else {
        showSvg1();
      }
      hideSvg2();
    } else if (position === 2) {
      if (DOM.info.classList.contains('visible')) {
        hideSvg2();
      } else {
        showSvg2();
      }
      hideSvg1();
    }
    if (DOM.container.classList.contains('visible') && lastVisible === position) {
      hideContainer();
    } else {
      showContainer(position);
    }
  }

  const update = (action, newState, payload) => {
    state = {
			...state,
			...newState
    };
    // console.log('svg', action);
		switch(action) {
			case 'toggle-svg':
				toggleVisibility(payload);
        break;
      case 'toggle-screen':
        hideContainer();
        break;
      case 'outro-started':
        hideContainer();
        break;
			default:
				return;
		}
  };

  return update;
};

export default SVG;
