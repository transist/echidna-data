var should = require('should');
var d3container = require('../d3container.js');

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
});