

var Person = require('../models/person');


// Route for sending all people with ids;
//  conforms with simple data model allowing
//  seamless interpretation via Backgrid via
//  Backbone collection interface, drops Neo4j
//  node object in favor of just the data.
//
//  Janky because there's probably a cleaner way
//  to do this than node._node._data.data 
//
exports.list = function(req, res, next) {

    Person.getAll(function(err, persons) {
        if(err) return next(err);

        var personList = persons.map(function(node) {

            var person = node._node._data.data;
            person.id = node.id;

            return person;
        });

        res.send(personList);
    });
};

// Route for creating people, simply supply
//  title and url paramaters and they will get
//  set into a new Neo4j node
//
//  Used to redirect you to the person page, 
//  however Backbone is handling that now.
exports.create = function(req, res, next) {

    var url = (req.body['url'] ? req.body['url'] : "");

    Person.create({

        title: req.body['title'],
        url: url

    }, function(err, person) {
        if(err) return next(err);
// Backbone handles frontend routing now
//  could send response data?
//        res.redirect('/people/' + person.id);
//        res.redirect('/#table');
    });
};

// Not used in current Backgrid iteration
//  don't want to mix old view methods with 
//  current Backbone implementation
/*
exports.show = function(req, res, next) {

    Person.get(req.params.id, function(err, person) {
        if(err) return next(err);

        person.getSkills(function(err, relatives, others) {
            if(err) return next(err);

            res.render('person', {
                person: person,
                relations: relatives,
                others: others 
            });
        });
    });
};
*/

// Update person, currently a put request
//  with title and url being updated based
//  on parameters; uses id to specify node
exports.edit = function(req, res, next) {

    Person.get(req.params.id, function(err, person) {
        if(err) return next(rer);

        //Is there a case where the request wouldn't have all of the
        // nodes data? I think yes
        if(req.body['title']) person.title = req.body['title'];
        if(req.body['url']) person.url = req.body['url'];

        person.save(function (err) {
            if (err) return next(err);
// Handled by Backbone on client now
//            res.redirect('/persons/' + person.id);
        });
    });
};


//TODO This needs to be implementated to show
// who's working with who or something along those lines
/*
exports.relate = function(req, res, next) {
    Person.get(req.params.id, function(err, person) {
        if(err) return next(err);

        Person.get(req.body.person.id, function(err, other) {
            if(err) return next(err);

            person.relate(other, function(err) {
                if(err) return next(err);

                res.redirect('/people/' + person.id);
            });
        });
    });
};
*/
