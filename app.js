
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io = require('socket.io');

var app = express();

app.set('port', 3000);
//app.set('port', 80);

app.use(function(req, res, next) {
    app.locals.pretty = true;
    next();
});

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/static'));

var server = http.createServer(app);

io = io.listen(server);

io.configure(function() {
    io.set('authorization', function(handshakeData, callback) {
        if(handshakeData.xdomain) {
            callback('Cross-domain connections are not allowed');
        } else {
            callback(null, true);
        }
    });
});

server.listen(app.get('port'), function() {
    console.log('Server running on http://localhost:%d/', app.get('port'));
});


//Routes
app.get('/table', routes.table.list);
app.get('/people', routes.persons.list);
app.put('/people/:id', routes.persons.edit);
app.post('/people', routes.persons.create);

//Implemented but not up to date with Backbone/Socket.io changes
//app.get('/people/:id', routes.persons.show);

app.get('/skills', routes.skills.list);

//Implemented but not up to date with Backbone/Socket.io changes
//app.post('/skills', routes.skills.create);
//app.get('/skills/:id', routes.skills.show);

//Implemented but not up to date with Backbone/Socket.io changes
//app.post('/people/:id/relate', routes.persons.relate);
//app.post('/skills/:id/relate', routes.skills.relate);

io.sockets.on('connection', function (socket) {

    socket.on('message', function (message) {
        console.log("Got message: " + message);
        ip = socket.handshake.address.address;
        url = message;
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': '***.***.***.' + ip.substring(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
    });

    socket.on('disconnect', function () {
        console.log("Socket disconnected");
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
    });
});


