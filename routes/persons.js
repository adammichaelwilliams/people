

var Person = require('../models/person');
var Skill = require('../models/skill');


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

    var title = (req.body['title'] ? req.body['title'] : "");
    var url = (req.body['url'] ? req.body['url'] : "");

    if(title == "") {
        res.send("Couldn't create person");
    }

    Person.create({

        title: req.body['title'],
        url: url

    }, {}, function(err, person) {
        if(err) return next(err);

        //HACK TODO TODO
        Skill.get(2, function(err, skill) {
            person.relate(skill, function(err) {
                if(err) {
                    console.log("couldn't create relation between %s and %s", person.title, skill.title);
                } 
                res.send(person);
            });
        });

// Backbone handles frontend routing now
//  could send response data?
//        res.redirect('/people/' + person.id);
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

getRelationshipAndId = function(key) {

    var rel_id_split_seq = "-";

    var split_loc = key.indexOf(rel_id_split_seq);
    if(split_loc == -1) return null;

    if(split_loc != key.lastIndexOf(rel_id_split_seq)) return null;

    var id_begin = split_loc + rel_id_split_seq.length;

    var skill_id = key.substr(id_begin, key.length);

    var skill = key.substr(0, split_loc);
    
    return { name: skill, 
             id: skill_id
            };
/*

    if(partial != "skill" || key == "skills") return;

    var skill_id = key.substr(5, key.length);
    console.log("skill id: %s", skill_id);
*/
}

// Update person, currently a put request
//  with title and url being updated based
//  on parameters; uses id to specify node
exports.edit = function(req, res, next) {

    Person.get(req.params.id, function(err, person) {
        if(err) return next(rer);

        //Is there a case where the request wouldn't have all of the
        // nodes data? I think yes
        person.title = (req.body['title'] ? req.body['title'] : "");
        person.url = (req.body['url'] ? req.body['url'] : "");

        var skills = []

        var data = {};

        for(var key in req.body) {

            var skillObj = getRelationshipAndId(key);

            if(skillObj == null) continue
            
            var skill_id = skillObj.id;
            //Relationship data
            data[skill_id] = req.body[key];

            skills.push(skill_id);
        }

        skills.forEach( function(id) {

            Skill.get(id, function(err, skill) {
                person.relateWithData(skill, data[id], function(err) {
                    if(err) {
                        console.log("couldn't create relation between %s and %s", person.title, skill.title);
                    }
                });
            });
        });

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
