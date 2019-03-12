var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PORT = 9000;
var strangers = {};
var cors = require('cors')

app.use(cors())

server.listen(process.env.PORT || PORT);

io.on('connection', function (socket) {
	strangers[socket.id] = { recipient: null };
	socket.emit('message', {
		class: 'notification',
		text: 'Welcome! ' + Object.keys(strangers) + ' strangers are currently using this app. Searching for a stranger...'
	});
  // socket.emit('message', { class: 'msg-stranger', text: 'Test message from stranger' });
	socket.on('message', function(data) {
		if (strangers[socket.id].recipient === null) return;
		io.to(strangers[socket.id].recipient).emit('message', { class: 'msg-stranger', text: data });
	});
	socket.on('next', function(data) {
		var recipient = strangers[socket.id].recipient
		if (recipient && recipient in strangers) strangers[recipient].recipient = null;
		io.to(socket.id).emit('message', { class: 'notification', text: 'Searching for a stranger...'  });
		io.to(strangers[socket.id].recipient).emit('message', { class: 'notification', text: 'Stranger disconnected.'  });
		io.to(strangers[socket.id].recipient).emit('message', { class: 'notification', text: 'Searching for a stranger...'  });
		strangers[socket.id].recipient = null;
	});
	socket.on('disconnect', function(data) {
		var recipient = strangers[socket.id].recipient
		if (recipient && recipient in strangers) strangers[recipient].recipient = null;
		io.to(strangers[socket.id].recipient).emit('message', { class: 'notification', text: 'Stranger disconnected.'  });
		io.to(strangers[socket.id].recipient).emit('message', { class: 'notification', text: 'Searching for a stranger...'  });
		delete strangers[socket.id];
	});
});

// Search for a stranger
setInterval(() => {
	var keys = Object.keys(strangers);
	keys.forEach(id => {
		if (strangers[id].recipient !== null) return;
		keys.forEach(sid => {
			if (id === sid || strangers[sid].recipient !== null) return;
			strangers[id].recipient = sid;
			strangers[sid].recipient = id;
			io.to(id).emit('message', { class: 'notification', text: 'Stranger connected. Say hi!' });
			io.to(sid).emit('message', { class: 'notification', text: 'Stranger connected. Say hi!' });
		})
	});
}, 1000);

console.log("Listening on " + PORT);
