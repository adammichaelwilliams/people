
exports.index = function(req, res){
    res.render('index');
};

exports.persons = require('./persons');
exports.skills = require('./skills');
