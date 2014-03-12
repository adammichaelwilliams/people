
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

app.set('port', 80);
//app.set('port', 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/', routes.index);

app.get('/people', routes.persons.list);
app.post('/people', routes.persons.create);
app.get('/people/:id', routes.persons.show);

app.post('/people/:id/relate', routes.persons.relate);

app.get('/skills', routes.skills.list);
app.post('/skills', routes.skills.create);
app.get('/skills/:id', routes.skills.show);

app.post('/skills/:id/relate', routes.skills.relate);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Server running on http://localhost:%d/', app.get('port'));
});


