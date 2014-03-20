// table routes
//



var Person = require('../models/person');
var Skill = require('../models/skill');

exports.list = function(req, res, next) {
    Skill.getAll(function(err, skills) {
        if(err) return next(err);
        Person.getPeopleWithSkills(function(err, persons) {
            if(err) return next(err);
        //            console.log("skills");
        //            console.log(skills);
            res.render('table', {
                persons: persons,
                skills: skills
            });
        });
    });
    /*
    Skill.getAll(function(err, skills) {
        if(err) return next(err);
        Person.getAll(function(err, persons) {
            if(err) return next(err);
            res.render('table', {
                persons: persons,
                skills: skills
            });
        });
    });
    */
};

