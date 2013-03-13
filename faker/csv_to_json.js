var fs = require('fs');
var $ = jQuery = require('jquery');
require('./faker/jquery.csv.js');

var words = [];

// READ CSV
var sample1 = './faker/random_words_sheet1.csv';
var sample2 = './faker/random_words_sheet2.csv';

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
    console.log( JSON.stringify(words) );
});

