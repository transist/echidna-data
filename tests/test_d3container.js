var moment = require('moment');
var should = require('should');
var d3container = require('../d3container.js');
var slice = require('../slice.js');

describe('d3container', function() {
    it('updates correctly single value', function() {
      var updater = new d3container.D3Container();
      updater.update('word', 'xvalue', 1);
      JSON.stringify(updater.current()).should.equal(
        JSON.stringify([{key: 'word', values: [{x: 'xvalue', y:1}]}]));
    });

    it('re-updates correctly single value', function() {
      var updater = new d3container.D3Container();
      updater.update('word', 'xvalue', 1);
      updater.update('word', 'xvalue', 2);

      JSON.stringify(updater.current()).should.equal(
        JSON.stringify([{key: 'word', values: [{x: 'xvalue', y:2}]}]));
    });

    it('updates correctly multiple x,y values', function() {
      var updater = new d3container.D3Container();

      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);

      JSON.stringify(updater.current()).should.equal(
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

    it('updates correctly multiple x,y values', function() {
      var updater = new d3container.D3Container();

      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);
      updater.update('word2', 3, 40);

      JSON.stringify(updater.current()).should.equal(
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
      var updater = new d3container.D3Container();

      updater.update('word1', 3, 30);
      updater.update('word1', 2, 20);
      updater.update('word1', 1, 10);

      JSON.stringify(updater.current()).should.equal(
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
      var updater = new d3container.D3Container();

      updater.update('word1', 1, 30);

      JSON.stringify(updater.current()).should.equal(
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

      JSON.stringify(updater.current()).should.equal(
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
      var updater = new d3container.D3Container(3);

      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);
      updater.update('word1', 4, 40);

      JSON.stringify(updater.current()).should.equal(
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
      var updater = new d3container.D3Container(4);
      updater.on('updated', function() { done(); });

      updater.update('word1', 1, 10);
      updater.update('word1', 2, 20);
      updater.update('word1', 3, 30);
      updater.update('word1', 4, 40);

    });

    it('emit event every update when no target value', function(done) {
      var updater = new d3container.D3Container();
      updater.on('updated', function() { done(); });
      updater.update('word1', 1, 10);
    });

    it('can update from a slice', function() {
      var updater = new d3container.D3Container();
      var s1 = new slice.Slice();
      var word = 'testword';
      var count = 10;
      var source = 'http://somewhere';
      var panel = 5;
      var timestamp = moment().utc();
      s1.setTime(timestamp.toJSON());
      s1.addValue(word, count, source, panel);

      updater.updateSlice(s1);

      JSON.stringify(updater.current()).should.equal(
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


    it('can update from two slices', function() {
      var updater = new d3container.D3Container();
      var s1 = new slice.Slice();
      var s2 = new slice.Slice();
      var word = 'testword';
      var count = 10;
      var source = 'http://somewhere';
      var panel = 5;
      var timestamp1 = moment().utc();
      var timestamp2 = moment().add('seconds', 1).utc();

      s1.setTime(timestamp1.toJSON());
      s1.addValue(word, count, source, panel);

      s2.setTime(timestamp2.toJSON());
      s2.addValue(word, count, source, panel);

      updater.updateSlice(s1);
      updater.updateSlice(s2);

      JSON.stringify(updater.current()).should.equal(
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

    it('can update with one slice that has no words', function() {
      var updater = new d3container.D3Container();
      var s1 = new slice.Slice();
      var s2 = new slice.Slice();
      var word = 'testword';
      var count = 10;
      var source = 'http://somewhere';
      var panel = 5;
      var timestamp1 = moment().utc();
      var timestamp2 = moment().add('seconds', 1).utc();

      s1.setTime(timestamp1.toJSON());
      s1.addValue(word, count, source, panel);

      s2.setTime(timestamp2.toJSON());

      updater.updateSlice(s1);
      updater.updateSlice(s2);

      JSON.stringify(updater.current()).should.equal(
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
    it('fails on invalid parameter that is not slice.Slice', function(done) {
      var updater = new d3container.D3Container();
      try {
        updater.updateSlice("String object");
      } catch(e) {
        done();
      }
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

    it('test that current() only returns new objects', function() {
      var updater = new d3container.D3Container(1);
      updater.update('word1', 1, 10);
      var current = updater.current();

      current[0].values[0].x.should.equal(1);
      current[0].values[0].marker = true;
      var current2 = updater.current();
      should.equal(current2[0].values[0].marker, undefined);
    });
});