const modules = {};

export const listen = (events, moduleID) => {
  modules[moduleID].events = events;
};

export const notify = (event) => {
  let module;
  Object.keys(modules).forEach((key) => {
    module = modules[key];
    if (module.events && module.events[event.type]) {
      module.events[event.type](event.data);
    }
  })
};