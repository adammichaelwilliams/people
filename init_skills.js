var Person = require('./models/person');
var Skill = require('./models/skill');
var buildDBSkill = function(jsonObj) {
    for(var entry in jsonObj) {
        entryData = jsonObj[entry];
        for(var title in entryData) {
            console.log(title);
            var skillData = {
                title: title,
                url: '' 
            }
            Skill.create(skillData, function(err) {
                if(err) {
                    console.log("Skill creation error");
                    console.log(err);
                    return;
                }
            });
        }
        return;
    }
};

var fs = require('fs');
var file = __dirname + '/data.json';

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    data = JSON.parse(data);
//  console.dir(data);
//    buildDB(data);
    buildDBSkill(data); //Run once!
});



