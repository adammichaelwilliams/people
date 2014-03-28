// skill routes
//



var Skill = require('../models/skill');


// Skill.getAll not implemented yet
exports.list = function(req, res, next) {
    Skill.getAll(function(err, skills) {
        if(err) return next(err);
        var skillList = skills.map(function(node) {
            var skill = node._node._data.data;
            skill.id = node.id;
            return skill;
        });
        res.send(skillList);
    });
};

exports.create = function(req, res, next) {
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


exports.edit = function(req, res, next) {
    Skill.get(req.params.id, function(err, skill) {
        if(err) return next(rer);
        skill.title = req.body['title'];
        skill.url = req.body['url'];
        skill.save(function (err) {
            if (err) return next(err);
//            res.redirect('/skills/' + skill.id);
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

