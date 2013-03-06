var should = require('should');
var moment = require('moment');
var slice = require('../slice.js');

describe('slice', function() {
  var word = 'testword';
  var count = 10;
  var source = 'http://somewhere';
  var panel = 5;
  var timestamp = '' + moment();

  it('object construction', function() {
    var s1 = new slice.Slice();
    s1.addValue(word, count, source, panel);
    s1.setTimestamp('' + moment());
    s1.toJSON().should.be.instanceof.String;
  });

  it('construction', function() {
    var s1 = new slice.Slice();
    s1.should.not.be.null;
  });

  it('construction', function() {
    var s1 = new slice.Slice(JSON.stringify({
      word:'hello',
      count: 10,
      source: 'some',
      panel: 0
    }));
    s1.should.not.be.null;
  });

  it('to/from JSON', function() {
    var s1 = new slice.Slice();
    s1.addValue(word, count, source, panel);
    s1.setTimestamp(timestamp);
    var s2 = new slice.Slice(s1.toJSON());
    s1.equals(s2).should.be.true;
  });

  it('same setting equals', function() {
    var s1 = new slice.Slice();
    s1.addValue(word, count, source, panel);
    s1.setTimestamp(timestamp);
    var s2 = new slice.Slice();
    s2.addValue(word, count, source, panel);
    s2.setTimestamp(timestamp);
    s2.equals(s2).should.be.true;
  });

  it('different word', function() {
    var s1 = new slice.Slice();
    s1.addValue(word, count, source, panel);
    s1.setTimestamp(timestamp);
    var s2 = new slice.Slice();
    s2.addValue(word + '1', count, source, panel);
    s2.setTimestamp(timestamp);

    s1.equals(s2).should.be.false;
  });


  it('different count', function() {
    var s1 = new slice.Slice();
    s1.addValue(word, count, source, panel);
    s1.setTimestamp(timestamp);
    var s2 = new slice.Slice();
    s2.addValue(word, count + 1, source, panel);
    s2.setTimestamp(timestamp);

    s1.equals(s2).should.be.false;
  });

  it('different source', function() {
    var s1 = new slice.Slice();
    s1.addValue(word, count, source, panel);
    s1.setTimestamp(timestamp);
    var s2 = new slice.Slice();
    s2.addValue(word, count, source + '1', panel);
    s2.setTimestamp(timestamp);

    s1.equals(s2).should.be.false;
  });

  it('different panel', function() {
    var s1 = new slice.Slice();
    s1.addValue(word, count, source, panel);
    s1.setTimestamp(timestamp);
    var s2 = new slice.Slice();
    s2.addValue(word, count, source, panel + 1);
    s2.setTimestamp(timestamp);
    s1.equals(s2).should.be.false;
  });

});