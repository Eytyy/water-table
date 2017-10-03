const Timeline = (props) => {
  const DOM = {
    main: document.querySelector('.timeline'),
    progress: document.querySelector('.timeline__progress'),
    rail: document.querySelector('.timeline__rail'),
  };

  const state = {
    timeLength: 324, // second
  };

  const stops = [
    { id: 1, label: 'Early Days', start: 0, end: 40 },
    { id: 2, label: '1960s', start: 40, end: 80 },
    { id: 4, label: '1970s', start: 80, end: 120 },
    { id: 6, label: '1980s', start: 120, end: 160 },
    { id: 7, label: '1990s', start: 160, end: 200 },
    { id: 8, label: '2000s', start: 200, end: 240 },
    { id: 9, label: '2010', start: 240, end: 260 },
    { id: 10, label: 'Future', start: 300, end: 324 },
  ];

  let introInterval;
  let trainPosition = 0;
  let passedStopsLength = null;

  const fillPassedStops = (currentTime) => {
    const passed = stops.filter(({ start }) => {
      return currentTime > start;
    });
    if (passed.length === passedStopsLength) {
      return;
    }
    document.querySelectorAll('.timeline-stop').forEach((el) => el.classList.remove('active'));
    passed.forEach(({ id }) => {
      document.getElementById(`stop-${id}`).classList.add('active');
    });
    passedStopsLength = passed.length;
  };

  const moveOnProgress = (currentTime) => {
    const stop = stops.find(({ start, end }) => {
      return currentTime >= start && currentTime <= end;
    });
    const width = (currentTime/state.timeLength * 100);
    DOM.progress.style.width = `${width}%`;
    fillPassedStops(currentTime);
  };

  const reset = () => {
    DOM.main.style.opacity = 0;
    DOM.progress.style.width = '5%';
  };

  const update = (action, state, opts) => {
    switch(action) {
      case 'start':
        DOM.main.style.opacity = 1;
        break;
      case 'tour-ended':
      case 'reset':
        reset();
        break;
      case 'video-progress':
        moveOnProgress(opts);
        break;
      default:
        return;
        break;
    }
  };

  function init() {
    const frag = document.createDocumentFragment();
    stops.forEach(({ label, start, id }) => {
      let el = document.createElement('div');
      let text = document.createElement('span')
      el.className = 'timeline-stop';
      el.id = `stop-${id}`;
      el.style.left = `${start/state.timeLength * 100}%`;
      text.innerText = label;
      text.className = 'timeline-stop__label';
      el.appendChild(text);
      frag.appendChild(el);
    });
    DOM.rail.appendChild(frag);
  }

  init();
  return update;
};

export default Timeline;