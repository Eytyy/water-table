const Timeline = (props) => {
  const DOM = {
    main: document.getElementById('timeline'),
    train: document.querySelector('.timeline__train'),
    text: document.querySelector('.timeline__train__text'),
  };

  let introInterval;
  let trainPosition = 0;
  
  const stopIntroProgress = () => {
    trainPosition = 0;
    DOM.main.classList.remove('visible');
    clearInterval(introInterval);
  };

  const moveThroughIntro = () => {
    DOM.main.classList.add('visible');
    introInterval = setInterval(() => {
      trainPosition += 1;
      DOM.train.style.left = `${trainPosition}px`;
    }, 1000);
  };

  const reset = () => {
    stopIntroProgress();
    DOM.train.style.left = '0px';
  };

  const update = (action, state, opts) => {
    switch(action) {
      case 'tour-ended':
      case 'reset':
        reset();
        break;
      case 'intro-started':
        moveThroughIntro();
        break;
      case 'intro-ended':
        stopIntroProgress();
        break;
      default:
        return;
        break;
    }
  };

  return update;
};

export default Timeline;