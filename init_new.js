var Person = require('./models/person');
var Skill = require('./models/skill');
var buildDBSkill = function(jsonObj) {

    for(var entry in jsonObj) {
        var person = jsonObj[entry];
        console.log(person);
        for( var skill in person ) {

            console.log(skill);
            var skillData = {
                title: skill,
                url: '' 
            }
            if(skill != "Email") {
                Skill.create(skillData, function(err) {
                    if(err) {
                        console.log("Skill creation error");
                        console.log(err);
                        return;
                    }
                });
            }
        }
    }
};

var buildDB = function(jsonObj) {
    this.jsonObj = jsonObj;

    Skill.getAll(function(err, skills) {
        //console.log(this.jsonObj);
        var idMap = {};
        for(skill in skills) {
    //                    console.log(skills[skill]['id']);
            var id = skills[skill]['id'];
            var title = skills[skill]['title'];
            //console.log("Skill #%s %s", id, title);
            idMap[title] = id;
        }
        this.idMap = idMap;

        for(var id in jsonObj) {
            var jsonEntry = jsonObj[id];
            var personData = {
                title: jsonEntry['People'],
                url: jsonEntry['Email']
            }
            Person.create(personData, jsonEntry, function(err, person, entry) {
                if(err) {
                    console.log("People creation error");
                    console.log(err);
                    return;
                }
                for(var skillTitle in this.idMap) {
                    console.log("*************");
                    console.log(skillTitle);
                    if(entry[skillTitle] && entry[skillTitle] != "") {
                        console.log("Skill %s found", skillTitle);
                        console.log(entry[skillTitle]);
                        console.log("Skills id is: %s", this.idMap[skillTitle]);
                        var skill_id = this.idMap[skillTitle];
                        console.log("%%%%%%%%%%%%%%%%%%%%%");
                        console.log(skill_id);

                        Skill.get(skill_id, function(err, skill) {
                            console.log("##################");
                            console.log(person.id);
                            console.log(skill.id);
                            if(skill.id < 2) return;
                            person.relate(skill, function(err) {
                                if(err) {
                                    console.log("Couldn't create relation");
                                    console.log(err);
                                } else {
                                    console.log("Rel created between %s and %s", skill.title, person.title);
                                }
//                                console.log(skill.title);
//                                console.log(person.title);
                                //return;
                            });
                        });
                    }
                }
            });
        }
    });
}

/*
var fs = require('fs');
var file = __dirname + '/data.json';

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    data = JSON.parse(data);
//  console.dir(data);
    buildDB(data);
//    buildDBSkill(data); //Run once!
});
*/



//Converter Class
var Converter=require("csvtojson").core.Converter;

//CSV File Path or CSV String or Readable Stream Object
var csvFileName="./data2.csv";

//new converter instance
var csvConverter=new Converter();

//end_parsed will be emitted once parsing finished
csvConverter.on("end_parsed",function(jsonObj){
   console.log(jsonObj.csvRows); //here is your result json object
//   buildDBSkill(jsonObj.csvRows); 
   buildDB(jsonObj.csvRows); 
});

   //read from file
csvConverter.from(csvFileName);


