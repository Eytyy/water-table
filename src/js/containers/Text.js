
import Intro from '../../data/text/intro';
import Outro from '../../data/text/outro';

// intro
// phases
// outro

const Text = () => {
  let opacityTimeout;
  const container = document.getElementById('textOverlay');
  container.style.fontSize = '82px';
  container.style.lineHeight = '2';
  
  function render(content = "") {
    clearTimeout(opacityTimeout);
    
    container.style.opacity = 0;
    const timerOpacity = () => {
      return new Promise((resolve, reject) => {
        opacityTimeout = setTimeout(() => {
          container.innerHTML = content;
          resolve();
        }, 1000);
      })
    };
    
    timerOpacity().then(() => {
      container.style.opacity = 1;
    });

  }

  const playIntroText = ({ introLength }) => {
    const delay = introLength / Intro.length;
    let c = 1;
    render(Intro[0]);
    const play = setInterval(() => {
      if (c === Intro.length) {
        clearInterval(play);
        return;
      }
      render(Intro[c]);
      c += 1;
    }, delay);
  };

  function update(action, state, opts) {
    switch(action) {
      case 'intro-started':
        playIntroText({...state});
        break;
      case 'intro-ended':
        render()
        break;
      case 'seek-video':
        console.log('phase')
        break;
      default:
        return;
    }
  }
  render();

  return update;
};

export default Text;