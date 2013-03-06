var should = require('should');
var slice = require('../slice.js');
var feedconfig = require('../feedconfig.js');

describe('feedconfig', function() {
  it('historic json is parseable', function() {
    var start = '2013-03-01T11:00:00';
    var end = '2013-03-01T11:02:00';
    var sampling = 'minute';
    var gender = 'Men';
    var tier = '1';
    var age = '18-';
    var count = 13;

    var fc = new feedconfig.FeedConfig(JSON.stringify({
      start: start,
      end: end,
      sampling: sampling,
      gender: gender,
      tier: tier,
      age: age,
      count: count
    }));
    var output = new feedconfig.FeedConfig(fc.toJSON());
    output.start.should.equal(start);
    output.end.should.equal(end);
    output.sampling.should.equal(sampling);
    output.gender.should.equal(gender);
    output.age.should.equal(age);
    output.tier.should.equal(tier);
  });

  it('realtime json is parseable', function() {
    var sampling = 'minute';
    var numberItems = 30;
    var gender = 'Men';
    var tier = '1';
    var age = '18-';
    var count = 21;

    var fc = new feedconfig.FeedConfig(JSON.stringify({
      sampling: sampling,
      numberItems: numberItems,
      gender: gender,
      tier: tier,
      age: age,
      count: count
    }));

    var output = new feedconfig.FeedConfig(fc.toJSON());
    output.numberItems.should.equal(numberItems);
    output.sampling.should.equal(sampling);
    output.gender.should.equal(gender);
    output.age.should.equal(age);
    output.tier.should.equal(tier);
    output.count.should.equal(count);
  });

  it('convenience methods', function() {
    var sampling = 'minute';
    var gender = 'Men';
    var tier = '1';
    var age = '18-';
    var count = 21;
    var start = '2013-03-01T11:00:00';
    var end = '2013-03-01T11:02:00'

    var fc = new feedconfig.FeedConfig();
    fc.setDemographics(gender,  age, tier);
    fc.setHistoric(start, end, sampling);
    fc.setWordCount(count);

    var output = new feedconfig.FeedConfig(fc.toJSON());
    output.sampling.should.equal(sampling);
    output.gender.should.equal(gender);
    output.age.should.equal(age);
    output.tier.should.equal(tier);
    output.count.should.equal(count);
  });

  it('boolean tests', function() {
    var sampling = 'minute';
    var gender = 'Men';
    var tier = '1';
    var age = '18-';
    var count = 21;
    var start = '2013-03-01T11:00:00';
    var end = '2013-03-01T11:02:00'
    var numberItems = 30;

    var fc = new feedconfig.FeedConfig();
    fc.setDemographics(gender, age, tier);
    fc.setHistoric(start, end, sampling);
    fc.setWordCount(count);

    fc.isHistoric().should.be.true;

    fc.setRealtime(sampling, numberItems);

    fc.isRealtime().should.be.true;
  });
});