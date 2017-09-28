const Timeline = (props) => {
  const DOM = {
    train: document.querySelector('.timeline__train'),
    text: document.querySelector('.timeline__train__text'),
  };

  let introInterval;
  let trainPosition = 0;
  
  const stopIntroProgress = () => {
    clearInterval(introInterval);
  };

  const moveThroughIntro = () => {
    introInterval = setInterval(() => {
      trainPosition += 1;
      DOM.train.style.left = `${trainPosition}px`;
    }, 1000);
  };

  const update = (action, state, opts) => {
    switch(action) {
      case 'intro-started':
        moveThroughIntro();
        break;
      case 'intro-ended':
        stopIntroProgress();
        break;
      case 'seek-video':
        console.log(state);
        break;
      case 'timer-progress':
        console.log(state);
        break;
      default:
        return;
    }
  };

  return update;
};

export default Timeline;