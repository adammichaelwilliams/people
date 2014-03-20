

exports.index = function(req, res, next){
    res.render('index');
};

exports.table = require('./table');
exports.persons = require('./persons');
exports.skills = require('./skills');
