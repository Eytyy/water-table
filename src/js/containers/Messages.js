const Messages = () => {
	const container = document.querySelector('.messages');
	let timer;

	const resetTimer = () => {
		clearTimeout(timer);
	};

	const update = (content = '') => {
		resetTimer();
		container.innerHTML = content;
		if (content !== '') {
			timer = setTimeout(() => {
				container.innerHTML = '';
			}, 3000)
		}
	};

	return update;
};

export default Messages;