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
  
  const template = `
    <div class="idle-big">
      <div class="idle-big__l">THIRST</div>
      <div class="idle-big__r">THIRST</div>
    </div>
    <div class="idle-paragraph">
      <p>You can start this journey<br /> with a click of a button, or<br />you can walk away.</p>
      <p>In any case the conclusion will be the same, unless things change,</p>
      <p>and change starts with &gt;&gt;us&lt;&lt;</p>
    </div>
    <div class="arrow">&darr;</div>
  `;

  const render = () => {
    container.innerHTML = template;
  }


  const update = (action, state, opts) => {
    switch(action) {
      case 'start':
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
    container.classList.add('visible');
    render();
    show();
  };

  init();

  return update;
};

export default Text;