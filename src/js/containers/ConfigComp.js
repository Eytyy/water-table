const ConfigComp = () => {
  const container = document.getElementById('debug');

  const template = ({ currentYear, timerSpeed, activeIndex, introLength }) => (`
    <div>Intro Length: ${introLength}</div>
    <div>Year: ${currentYear}</div>
    <div>Speed: ${timerSpeed}ms</div>
    <div>Index: ${activeIndex}</div>
  `);
  
  function update(props) {
    container.innerHTML = template({...props});
  };

  return update;
};

export default ConfigComp;