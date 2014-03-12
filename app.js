
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

/*
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var node = db.createNode({hello: 'world'});     // instantaneous, but...
node.save(function (err, node) {    // ...this is what actually persists.
    if (err) {
        console.error('Error saving new node to database:', err);
    } else {
        console.log('Node saved to database with id:', node.id);
    }
});
*/

app.set('port', 3000);

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

/* Node stuff
var fs = require('fs');

fs.readFile('PrintSingleCity.c', 'utf8', function(err, data) {

  if(err) {
      return console.log(err);
  }
  lineByLine(data);
});

function lineByLine(data) {

  var lineData = data.split('\n');
  for(var line in lineData) {
    console.log("line: ", line);
    console.log("data[", line,"] ", lineData[line]);
  }
}
*/


/* underscore template stuff
 
  var
    Declares a variable, optionally initializing it to a value. 

  function
    The Function constructor creates a new Function object. In JavaScript every function is actually a Function object.

  return
    Specifies the value to be returned by a function.

*/


