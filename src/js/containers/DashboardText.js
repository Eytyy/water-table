import data from '../../data/text/text.dashboard';

const DashboardText = (props) => {
  const state = {
    cycleLength: 0,
    index: 0,
    activeCycleYear: 0,
    timerRef: null,
    fadeRef: null,
    container: null,
    fadeDuration: 500,
  };

  const fade = () => {
    clearTimeout(state.faderef);
    state.container.style.opacity = 0;

    state.faderef = setTimeout(() => {
      state.container.innerText = data[state.activeCycleYear][state.index];
      state.container.style.opacity = 1;
      state.index += 1;
    }, state.fadeDuration);
  };
  
  const startTextSlide = (container) => {
    clearInterval(state.timerRef);
    const duration = 4000 * 10 / state.cycleLength;
    const maxduration = duration <= 12000 ? duration : 12000;
    // clear interval incase called before finishing.
    if (state.index === 0) {
      fade();
    }

    state.timerRef = setInterval(() => {
      if (state.index === state.cycleLength) {
        clearInterval(state.timerRef);
        state.container.innerText = '';
        return;
      }
      fade();
    }, maxduration + state.fadeDuration);
  };

  const setTextCycle = (year) => {
    if (data[year]) { // new year reset state
      state.index = 0;    
      state.activeCycleYear = year;
      state.cycleLength = data[year].length;
      startTextSlide();
    }
    return;
  };

  const update = (year, container) => {
    state.container = container;
    setTextCycle(year);
  }

  return update;
};

export default DashboardText;