// person routes
//



var Person = require('../models/person');


exports.list = function(req, res, next) {
    Person.getAll(function(err, persons) {
        if(err) return next(err);
        //res.render('persons', {
        var personList = persons.map(function(node) {
            console.log(node);
            var person = node._node._data.data;
            return person;
//            return node;
        });
        res.send(personList);
//        res.send({
//            persons: persons
//        });
    });
};

exports.create = function(req, res, next) {
    console.log("create req: %s \n res: %s \n", req, res);
    console.log(req.body);
    Person.create({
        title: req.body['title'],
        url: req.body['url']
    }, function(err, person) {
        if(err) return next(err);
        res.redirect('/people/' + person.id);
    });
};

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

