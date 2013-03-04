var moment = require('moment');

function FeedConfig(data) {
    var self = this;

    self.validGender = [
      'Both',
      'Men',
      'Women'
    ];

    self.validAgeRange = [
      '18-',
      '24-',
      '35-',
      '40+'
    ];

    self.validTier = [
      'Tier1',
      'Tier2',
      'Tier3',
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
          sampling: self.sampling
        });
      } else if(self.type === 'realtime') {
        return JSON.stringify({
          gender: self.gender,
          tier: self.tier,
          age: self.age,
          numberItems: self.numberItems,
          sampling: self.sampling
        });
      } else {
        throw new Error('not configured for historic data');
      }
    };

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
      } else {
        self.gender = null;
        self.age = null;
        self.tier = null;
        self.type = null;
      }
    }
    self.setData(data);

    return self;
}

exports.FeedConfig = FeedConfig;