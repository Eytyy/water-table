import IdleText from '../../data/text/idle';

const Text = (props) => {

  let opacityTimeout;
  let lastClassName =  '';
  
  const { isIdle } = props;
  const container = document.querySelector('.textOverlay');

  const show = () => {
    container.classList.add('visible');
  };

  const hide = () => {
    container.classList.remove('visible');
  }
  
  const updateClasses = (className) => {
    if (lastClassName) {
      container.classList.remove(lastClassName);
    }
    if (className) {
      container.classList.add(className);
      lastClassName = className;
    }
  };

  const render = (content, className) => {
    clearTimeout(opacityTimeout);
    hide();
    
    updateClasses(className);

    const timerOpacity = () => {
      return new Promise((resolve, reject) => {
        opacityTimeout = setTimeout(() => {
          if (content === '') {
            container.innerHTML = ''
          } else {
            container.appendChild(content);
          }
          resolve();
        }, 1000);
      })
    };
    
      timerOpacity().then(() => {
        show();
    });
  }

  const showIdleText = () => {
    const frag = document.createDocumentFragment();
    IdleText.forEach((item, index) => {
      let child = document.createElement('div');
      let text = document.createTextNode(item);
      child.appendChild(text);
      child.className = `idle-${index}`;
      frag.appendChild(child);
    });
    render(frag, 'idle')
  };

  const update = (action, state, opts) => {
    switch(action) {
      case 'intro-started':
        hide();
        break;
      case 'tour-ended':
        show();
        break;
      default:
        return;
    }
  }

  const init = () => {
    if (isIdle) {
      container.classList.add('visible');
      show();
      showIdleText();
    }
  };

  init();

  return update;
};

export default Text;