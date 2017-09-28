import data from '../../data/text/text.dashboard';

const DashboardText = (props) => {
  const state = {
    cycleLength: 0,
    index: 0,
    activeCycleYear: 0,
    timerRef: null,
  };

  const startTextSlide = (container) => {
    clearInterval(state.timerRef);
    const duration = 4000 * 10 / state.cycleLength;
    // clear interval incase called before finishing.
    
    if (state.index === 0) {
      container.innerText = data[state.activeCycleYear][state.index];
      state.index += 1;
    }

    state.timerRef = setInterval(() => {
      if (state.index === state.cycleLength) {
        clearInterval(state.timerRef);
        return;
      }
      
      container.innerText = data[state.activeCycleYear][state.index];
      state.index += 1;
    }, duration);
  };

  const setTextCycle = (year, container) => {
    if (data[year]) { // new year reset state
      state.index = 0;    
      state.activeCycleYear = year;
      state.cycleLength = data[year].length;
      startTextSlide(container);
    }
    return;
  };

  const update = (year, container) => {
     setTextCycle(year, container);
  };

  return update;
};

export default DashboardText;