// skill routes
//



var Skill = require('../models/skill');


// Skill.getAll not implemented yet
exports.list = function(req, res, next) {
    Skill.getAll(function(err, skills) {
        if(err) return next(err);
        res.render('skills', {
            skills: skills
        });
    });
};

exports.create = function(req, res, next) {
    console.log("create req: %s \n res: %s \n", req, res);
    console.log(req.body);
    Skill.create({
        title: req.body['title'],
        url: req.body['url']
    }, function(err, skill) {
        if(err) return next(err);
        res.redirect('/skills/' + skill.id);
    });
};

exports.show = function(req, res, next) {
    Skill.get(req.params.id, function(err, skill) {
        if(err) return next(err);
        skill.getRelations(function(err, relatives, others) {
            if(err) return next(err);
            res.render('skill', {
                skill: skill,
                relations: relatives,
                others: others 
            });
        });
    });
};

exports.relate = function(req, res, next) {
    Skill.get(req.params.id, function(err, skill) {
        if(err) return next(err);
        Skill.get(req.body.skill.id, function(err, other) {
            if(err) return next(err);
            skill.relate(other, function(err) {
                if(err) return next(err);
                res.redirect('/skills/' + skill.id);
            });
        });
    });
};

