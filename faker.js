var words = require('./faker/keywords')
var sliceGen = require('../echidna-data/slice');
var FeedConfig = require('./feedconfig')

// console.log(feedconfig.validTier);

// var feedconfig = new FeedConfig.FeedConfig();
// feedconfig.setGender("Both")
// feedconfig.setAgeRange("18-")
// feedconfig.setTier("2")
// filterKeywords(feedconfig);

function filterKeywords(feedconfig) {


    // Feedconfig
    if(!(feedconfig instanceof FeedConfig.FeedConfig))
      throw new Error('not a feedconfig');

    // console.log(feedconfig)

    var _gender = feedconfig.gender;
    var _age = feedconfig.age;
    var _tier = feedconfig.tier;


    // Build request
    var genderFilter;

    if(_gender == "Men") genderFilter = function(p) { return p.gender == 'M' }
    else if (_gender == "Women")  genderFilter = function(p) { return p.gender == 'F' }
    else genderFilter = function(p) { return p.gender == 'F' || p.gender == 'M' }

    var ageFilter;

    if( _age =='18-' ) ageFilter = function(p) {return p.age <= 18}
    else if( _age == '24-') ageFilter = function(p) {return p.age >= 18 && p.age <= 24}
    else if( _age == '35-') ageFilter = function(p) {return p.age >= 25 && p.age <= 35}
    else if( _age == '40+') ageFilter = function(p) {return p.age >= 36}
    else ageFilter = function(p) { return p.age }

    var tierFilter;
    if(_tier == '1')  tierFilter = function(p)  {return p.tier == "T1"}
    else if(_tier == '2')  tierFilter = function(p)  {return p.tier == "T2"}
    else if(_tier == '3')  tierFilter = function(p)  {return p.tier == "T3"}
    else                   tierFilter = function(p) {return p.tier }


    // Filter words
    var results = words
      .filter( genderFilter)
      .filter( ageFilter )
      .filter( tierFilter );
    
    // console.log(results)
    return results

}


exports.newSlice = function (feedconfig){
    
    var slice = new sliceGen.Slice();

    // feedconfig.numberItems
    // feedconfig.gender
    // feedconfig.ageRange

    var results = filterKeywords(feedconfig); 
    // console.log(results);
    
    for (var i = 0; i < feedconfig.numberItems; i++) {

      // var word = randomKeywords.randomElement();
      
      if ( i < results.length ) { 
        var word = results[i].word;
        var count = Math.round(20*Math.random());
      
      } else {

        // add empty variables for missing words
        var word = null;
        var count = 0;
        
      }
        
        var source = 'http://weibo.com/ID';
        var panel = 5;

      
      slice.addValue(word, count, source, panel);
    
    };

    // console.log(slice)

    return slice;
}

exports.listStats = function () {

  var stats = [];
  var feedconfig = new FeedConfig.FeedConfig();
  feedconfig.setRealtime("second",10); // fix error
  feedconfig.setWordCount(10)
  // console.log(feedconfig)


  for (var j = 0; j < feedconfig.validGender.length; j++) {
    
    var feedconfig = new FeedConfig.FeedConfig();
    

    for (var i = 0; i < feedconfig.validTier.length; i++) {

      
      for (var k = 0; k < feedconfig.validAgeRange.length; k++) {
        
        feedconfig.setTier(feedconfig.validTier[i]);
        feedconfig.setGender(feedconfig.validGender[j]);
        feedconfig.setAgeRange(feedconfig.validAgeRange[k]);

        var results = filterKeywords(feedconfig);
        var stat = {

          number: results.length,
          Gender : feedconfig.validGender[j],
          Tier : feedconfig.validTier[i],
          AgeRange : feedconfig.validAgeRange[k]
          // filter : feedconfig.toJSON()
        }

        stats.push(stat);


      };

    };

  };
  
  console.log(stats)

  return stats

}