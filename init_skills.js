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



/*
var csv = require('csv');
var fs = require('fs');
csv()
    .from.stream(fs.createReadStream(__dirname+'/data.csv'))
    .to.path(__dirname+'/sample.out')
    .transform( function(row){
          row.unshift(row.pop());
            return row;
    })
.on('record', function(row,index){
      console.log('#'+index+' '+JSON.stringify(row));
})
.on('end', function(count){
      console.log('Number of lines: '+count);
})
.on('error', function(error){
      console.log(error.message);
});
*/
/*
//Converter Class
var Converter=require("csvtojson").core.Converter;

//CSV File Path or CSV String or Readable Stream Object
var csvFileName="./people.csv";

//new converter instance
var csvConverter=new Converter();

//end_parsed will be emitted once parsing finished
csvConverter.on("end_parsed",function(jsonObj){
   console.log(jsonObj); //here is your result json object
//    buildDB(jsonObj); 
});

   //read from file
csvConverter.from(csvFileName);
*/


