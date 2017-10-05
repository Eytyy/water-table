const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);

var io = require('socket.io')(server);

io.on('connection', function(client) {  
	client.on('join', function(data) {
		console.log(data);
	});

	// controller
	client.on('controller', function(data) {
		client.broadcast.emit('controller', data);
	});

	client.on('from-table', function(data) {
		client.broadcast.emit('from-table', data);
	});

});

const port = process.env.PORT || 3000;

app.use(express.static('dist'));

app.get('*', (req, res) => {
	res.sendFile(path.resolve('dist/index.html'));
});

server.listen(port);