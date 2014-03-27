
var Person = require('../models/person');
var Skill = require('../models/skill');

//Super janky route for passing a user and their
// skills to a Backbone collection to be shown on
// a Backgrid table. Rather than base on relationship
// attributes, this simply places an X as the value on
// a key based on it's own id (the skill's id). This 
// allows our super-simple Backgrid imp. to display this
// data, however it doesn't allow the relationship to be 
// updated(!) TODO
//
exports.list = function(req, res, next) {

    //Get all people with their skills
    Person.getPeopleWithSkills(function(err, persons) {
        if(err) return next(err);

        //Map people's data from Neo4j node to simple object
        //  for easy Backbone Collection fetching
        //    TODO there's a better way to do this.
        //    Also, this logic should exist within the model?
        personCollection = persons.map(function(node) {

            //Nasty, please fix!
            // toJSON method for nodes?
            var person = node._node._data.data;
            person.id = node.id;
           
            //Grab skills from nodes
            var skills = node.skills;

            //Map person's skills from Neo4j node to simple objects
            person.skills = skills.map(function(other) {

                var skill = other._node._data.data;
                skill.id = 'skillz-'+other.id;
                return skill;
            });

            return person;
        });

        res.send(personCollection);
    });
};

