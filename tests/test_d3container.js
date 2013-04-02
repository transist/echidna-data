var moment = require('moment');
var should = require('should');
var d3container = require('../d3container.js');
var slice = require('../slice.js');

describe('d3container', function() {

    var s1 = new slice.Slice();
    var word = 'testword';
    var count = 10;
    var source = 'http://somewhere';
    var panel = 5;
    var timestamp = moment().utc();
    var current;

    beforeEach(function() {
      current = [];
    });

    it('update correctly with single value', function() {
      var updater = new d3container.D3Container(current);
      updater.update('word', 'xvalue', 1);
      JSON.stringify(current).should.equal(
        JSON.stringify([{key: 'word', values: [{x: 'xvalue', y:1}]}]));
    });

    it('re-updates correctly single value', function() {
      var updater = new d3container.D3Container(current);
      updater.update('word', 'xvalue', 1);
      updater.update('word', 'xvalue', 2);

      JSON.stringify(current).should.equal(
        JSON.stringify([{key: 'word', values: [{x: 'xvalue', y:2}]}]));
    });

    it('updates correctly multiple x,y values', function() {
      var updater = new d3container.D3Container(current);

      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: 'word1',
              values:
              [
                {x:1, y:10},
                {x:2, y:20},
                {x:3, y:30},
              ]
            }
          ]
        ));
    });

    it('updates correctly multiple words with multiple x,y values', function() {
      var updater = new d3container.D3Container(current);

      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);
      updater.update('word2', 3, 40);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: 'word1',
              values:
              [
                {x:1, y:10},
                {x:2, y:20},
                {x:3, y:30},
              ]
            },
            {
              key: 'word2',
              values:
              [
                {x:1, y:0},
                {x:2, y:0},
                {x:3, y:40},
              ]
            },
          ]
        ));
    });

    it('out-of-order updates on x (time) still give proper sorted results', function() {
      var updater = new d3container.D3Container(current);

      updater.update('word1', 3, 30);
      updater.update('word1', 2, 20);
      updater.update('word1', 1, 10);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: 'word1',
              values:
              [
                {x:1, y:10},
                {x:2, y:20},
                {x:3, y:30},
              ]
            },
          ]
        ));
    });

    it('update, current, update, current cycle works', function() {
      var updater = new d3container.D3Container(current);

      updater.update('word1', 1, 30);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: 'word1',
              values:
              [
                {x:1, y:30},
              ]
            },
          ]
        )
      );

      updater.update('word1', 2, 40);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: 'word1',
              values:
              [
                {x:1, y:30},
                {x:2, y:40},
              ]
            },
          ]
        )
      );
    });

    it('parametrizable number of values', function() {
      var updater = new d3container.D3Container(current, 3);

      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);
      updater.update('word1', 4, 40);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: 'word1',
              values:
              [
                {x:2, y:20},
                {x:3, y:30},
                {x:4, y:40},
              ]
            },
          ]
        )
      );
    });

    it('emit event when reach target number of values', function(done) {
      var updater = new d3container.D3Container(current, 4);
      updater.on('updated', function() { done(); });

      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);
      updater.update('word1', 4, 40);
    });

    it('exceeded array cuts off older values', function() {
      var updater = new d3container.D3Container(current, 3);
      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);
      updater.update('word1', 4, 40);
      JSON.stringify(current).should.equal(JSON.stringify([{"key":"word1","values":[{"x":2,"y":20},{"x":3,"y":30},{"x":4,"y":40}]}
]));
    });

    it('emit event every update when no target value', function(done) {
      var updater = new d3container.D3Container(current);
      updater.on('updated', function() { done(); });
      updater.update('word1', 1, 10);
    });

    it('can update from a slice', function() {
      var updater = new d3container.D3Container(current);

      s1.setTime(timestamp.toJSON());
      s1.addValue(word, count, source, panel);

      updater.updateSlice(s1);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: word,
              values:
              [
                {x: timestamp.valueOf(), y:count},
              ]
            },
          ]
        )
      );
    });

    it('can update from a slice with a partial timestamp', function() {
      var updater = new d3container.D3Container(current);
      var partial_timestamp = '2013-03-12T01';
      s1.setTime(partial_timestamp);
      s1.addValue(word, count, source, panel);

      updater.updateSlice(s1);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: word,
              values:
              [
                {x: moment(partial_timestamp).valueOf(), y:count},
              ]
            },
          ]
        )
      );
    });


    it('can update from two slices', function() {
      var updater = new d3container.D3Container(current);
      var s1 = new slice.Slice();
      var s2 = new slice.Slice();
      var timestamp1 = moment().utc();
      var timestamp2 = moment().add('seconds', 1).utc();

      s1.setTime(timestamp1.toJSON());
      s1.addValue(word, count, source, panel);

      s2.setTime(timestamp2.toJSON());
      s2.addValue(word, count, source, panel);

      updater.updateSlice(s1);
      updater.updateSlice(s2);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: word,
              values:
              [
                // moment.valueOf : milliseconds
                // moment.unix() : seconds
                {x: timestamp1.valueOf(), y:count},
                {x: timestamp2.valueOf(), y:count},
              ]
            },
          ]
        )
      );
    });

    it('reset between two slices only result in second slice', function() {
      var updater = new d3container.D3Container(current);
      var s1 = new slice.Slice();
      var s2 = new slice.Slice();
      var timestamp1 = moment().utc();
      var timestamp2 = moment().add('seconds', 1).utc();

      s1.setTime(timestamp1.toJSON());
      s1.addValue(word, count, source, panel);

      s2.setTime(timestamp2.toJSON());
      s2.addValue(word, count, source, panel);

      updater.updateSlice(s1);
      updater.reset()
      updater.updateSlice(s2);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: word,
              values:
              [
                // moment.valueOf : milliseconds
                // moment.unix() : seconds
                {x: timestamp2.valueOf(), y:count},
              ]
            },
          ]
        )
      );
    });

    it('can update with one slice that has no words', function() {
      var updater = new d3container.D3Container(current);
      var s1 = new slice.Slice();
      var s2 = new slice.Slice();
      var timestamp1 = moment().utc();
      var timestamp2 = moment();
      timestamp2.add('second', 1).utc();

      s1.setTime(timestamp1.toJSON());
      s1.addValue(word, count, source, panel);

      s2.setTime(timestamp2.toJSON());
      // NO WORDS IN s2

      updater.updateSlice(s1);
      updater.updateSlice(s2);

      JSON.stringify(current).should.equal(
        JSON.stringify(
          [
            {
              key: word,
              values:
              [
                // moment.valueOf : milliseconds
                // moment.unix() : seconds
                {x: timestamp1.valueOf(), y:count},
                {x: timestamp2.valueOf(), y:0},
              ]
            },
          ]
        )
      );
    });

    it('reset on empty object', function() {
      var updater = new d3container.D3Container(current);
      updater.setDesiredNumberOfXvalues(20);
      JSON.stringify(current).should.equal(JSON.stringify([]));
    });

    it('alternative parameter-less construction', function() {
      var updater = new d3container.D3Container();
      updater.setArray(current);
      updater.set
      updater.reset();
      JSON.stringify(current).should.equal(JSON.stringify([]));
    });


    it('fails on invalid parameter that is not slice.Slice', function(done) {
      var updater = new d3container.D3Container(current);
      try {
        updater.updateSlice("String object");
      } catch(e) {
        done();
      }
    });

    it('test data from the simulated UI updates correctly', function() {
      var testslice = '{"time":"1364888911281","words":[{"word":"欧美风","count":5,"source":"http://weibo.com/ID","panel":5},{"word":"七分袖","count":18,"source":"http://weibo.com/ID","panel":5},{"word":"堆堆领","count":6,"source":"http://weibo.com/ID","panel":5},{"word":"呢大衣","count":9,"source":"http://weibo.com/ID","panel":5},{"word":"违带裤","count":1,"source":"http://weibo.com/ID","panel":5},{"word":"橄榄领","count":8,"source":"http://weibo.com/ID","panel":5},{"word":"衬衫","count":4,"source":"http://weibo.com/ID","panel":5},{"word":"韩版","count":4,"source":"http://weibo.com/ID","panel":5},{"word":"工装靴裤","count":14,"source":"http://weibo.com/ID","panel":5},{"word":"字母","count":4,"source":"http://weibo.com/ID","panel":5}]}';
      var updater = new d3container.D3Container(current);
      updater.updateSlice(new slice.Slice(testslice));
      JSON.stringify(current).should.equal(JSON.stringify([{"key":"字母","values":[{"x":1364888911281,"y":4}]},{"key":"工装靴裤","values":[{"x":1364888911281,"y":14}]},{"key":"韩版","values":[{"x":1364888911281,"y":4}]},{"key":"衬衫","values":[{"x":1364888911281,"y":4}]},{"key":"橄榄领","values":[{"x":1364888911281,"y":8}]},{"key":"违带裤","values":[{"x":1364888911281,"y":1}]},{"key":"呢大衣","values":[{"x":1364888911281,"y":9}]},{"key":"堆堆领","values":[{"x":1364888911281,"y":6}]},{"key":"七分袖","values":[{"x":1364888911281,"y":18}]},{"key":"欧美风","values":[{"x":1364888911281,"y":5}]}]));
    });

    it('moment works as expected and keeps the timezone information', function() {
      // https://github.com/timrwood/moment/pull/646
      var t = moment().utc(); // casting to utc manually is a workaround
      t.unix().should.equal(moment(t.toJSON()).unix());
    });

    it('moment and Date.parse compatible', function() {
      var t = moment().utc();
      t.valueOf().should.equal(Date.parse(t.toJSON()));
    });
});