// http://momentjs.com/
var moment = require('moment');

function FeedConfig(data) {
    var self = this;
    
    // TODO: these should be loaded from JSON object
    self.validGender = [
      'Both',
      'Men',
      'Women'
    ];

    self.validAgeRange = [
      'All',
      '18-',
      '24-',
      '35-',
      '40+'
    ];

    self.validTier = [
      '1',
      '2',
      '3',
      'All'
    ];

    self.validSampling = [
      "second",
      "minute",
      "hour",
      "day",
      "month",
      "year"
    ];

    self.setType = function(type) {
      if(type !== 'historic' && type !== 'realtime')
        throw new Error('Invalid type ' + type);
      self.type = type;
    };

    self.setGender = function(gender) {
      if(self.validGender.indexOf(gender) == -1)
        throw new Error('Invalid gender: ' + gender)
      self.gender = gender;

    };

    self.setAgeRange = function(age) {
      if(self.validAgeRange.indexOf(age) == -1)
        throw new Error('Invalid age range: ' + age)
      self.age = age;
    };

    self.setTier = function(tier) {
      if(self.validTier.indexOf(tier) == -1)
        throw new Error('Invalid tier: ' + tier)
      self.tier = tier;
    };

    self.setSampling = function(sampling) {
      if(self.validSampling.indexOf(sampling) == -1)
        throw new Error('Invalid sampling: ' + sampling)
      self.sampling = sampling;
    };

    self.setStart = function(start) {
      if(!moment(start).isValid())
        throw new Error("Invalid datetime: " + start);
      self.start = start;
    }

    self.setEnd = function(end) {
      if(!moment(end).isValid())
        throw new Error("Invalid datetime: " + end);
      self.end = end;
    }

    self.setNumberItems = function(numberItems) {
      if(!(numberItems > 0))
        throw new Error("Invalid number of items: " + numberItems);
      self.numberItems = numberItems;
    }

    self.setDemographics = function(gender, age, tier) {
      self.setGender(gender);
      self.setAgeRange(age);
      self.setTier(tier);
    };

    self.setWordCount = function(count) {
      self.count = count;
    };

    self.setHistoric = function(start, end, sampling) {
      self.setType('historic');
      self.setStart(start);
      self.setEnd(end);
      self.setSampling(sampling);
    };

    self.setRealtime = function(sampling, numberItems) {
      self.setType('realtime');
      self.setNumberItems(numberItems);
      self.setSampling(sampling);
    };


    self.toJSON = function() {
      if(self.type === 'historic') {
        return JSON.stringify({
          gender: self.gender,
          tier: self.tier,
          age: self.age,
          start: self.start,
          end: self.end,
          sampling: self.sampling,
          count: self.count
        });
      } else if(self.type === 'realtime') {
        return JSON.stringify({
          gender: self.gender,
          tier: self.tier,
          age: self.age,
          numberItems: self.numberItems,
          sampling: self.sampling,
          count: self.count
        });
      } else {
        throw new Error('not configured for historic data');
      }
    };

    self.isHistoric = function() {
      return self.type === 'historic';
    }

    self.isRealtime = function() {
      return self.type === 'realtime';
    }

    self.setData = function(data) {
      if(data) {
        var data = JSON.parse(data);
        if(data.start) {
          self.setType('historic');
          self.setStart(data.start);
          self.setEnd(data.end);
        } else {
          self.setType('realtime');
          self.setNumberItems(data.numberItems);
        }
        self.setGender(data.gender);
        self.setAgeRange(data.age);
        self.setTier(data.tier);
        self.setSampling(data.sampling);
        self.setWordCount(data.count);
      } else {
        self.type = null;
        self.gender = null;
        self.age = null;
        self.tier = null;
        self.count = null;
        self.start = null;
        self.end = null;
      }
    }

    self.setToDefault = function() {
      
      self.setDemographics("Both","All","All");
      self.setRealtime("second", 10);
      self.setWordCount(10);

    }

    self.setData(data);
    
    return self;
}

exports.FeedConfig = FeedConfig;
