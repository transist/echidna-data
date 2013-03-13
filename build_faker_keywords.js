var fs = require('fs');
var $ = jQuery = require('jquery');
require('./faker/jquery.csv.js');
var faker = require('./faker')


// FILES
var OUT_FILE = "./faker/keywords.json";
var sample1 = './faker/random_words_sheet1.csv';
var sample2 = './faker/random_words_sheet2.csv';


// READ CSV
var words = [];
var json;

fs.readFile(sample1, 'UTF-8', function(err, csv) {
  $.csv.toObjects(csv, {}, function(err, data) {
    for(var i=0, len=data.length; i<len; i++) {
      // console.log(data[i]);
      words.push(data[i]);
    }
  });
});

fs.readFile(sample2, 'UTF-8', function(err, csv) {
  $.csv.toObjects(csv, {}, function(err, data) {
    for(var i=0, len=data.length; i<len; i++) {
      // console.log(data[i]);
      words.push(data[i]);
    }
  });

  // console.log( JSON.stringify(words) );
  json = JSON.stringify(words);

  writeToFile(json);
});

function writeToFile (json) {
  
  fs.writeFile(OUT_FILE, json, function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file contains : ");
          faker.listStats();
          console.log("The keywords file was saved!");
      }
  });
}


