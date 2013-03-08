"use strict";

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var slice = require('./slice.js');
var moment = require('moment');

function D3Container(desiredNumberOfXValues) {
  var self = this;

  self.d3 = [];
  self.keyToIndexes = {};
  self.xIndexes = {};
  self.xValues = [];
  self.maxIndex = 0;
  self.desiredNumberOfXValues = desiredNumberOfXValues;

  self.getKeyIndex = function(key) {
    // if does not exist, initialize
    if(self.keyToIndexes[key] === undefined) {
      self.keyToIndexes[key] = {};
      self.keyToIndexes[key].keyIndex = self.d3.length;
      self.keyToIndexes[key].xIndexes = {};
      self.d3.push({key: key, values: []});
    }
    return self.keyToIndexes[key].keyIndex;
  };

  self.getXIndex = function(key, keyIndex, x) {
    if(self.xIndexes[x] === undefined) {
      self.xIndexes[x] = self.maxIndex++;
      self.xValues.push({x: x, index: self.xIndexes[x]});
    }
    if(self.d3[keyIndex].values[self.xIndexes[x]] === undefined) {
      self.d3[keyIndex].values[self.xIndexes[x]] = {x:-1, y:-1};
    }
    return self.xIndexes[x];
  };

  // key is word
  // x is timestamp in unix time
  // y is count
  self.update = function(key, x, y) {
    var keyIndex = self.getKeyIndex(key);
    var xIndex = self.getXIndex(key, keyIndex, x);
    self.d3[keyIndex].values[xIndex].x = x;
    self.d3[keyIndex].values[xIndex].y = y;
    if(!self.desiredNumberOfXValues || self.xValues.length >= self.desiredNumberOfXValues) {
      this.emit('updated');
    }
  };

  self.updateSlice = function(s) {
    if(!(s instanceof slice.Slice))
      throw new Error('not a slice');
    var v;
    while(v = s.next()) {
      var unixTime = moment(s.getTime()).unix();
      self.update(v.word, unixTime, v.count);
    }
  };

  self.current = function() {
    // xValues contain all possible x (timestamp)
    self.xValues.sort(function(a,b) {
      return a.x - b.x;
    });

    // if we already have more than what this container needs, trim the list
    if(self.desiredNumberOfXValues && self.xValues.length > self.desiredNumberOfXValues) {
      self.xValues.splice(0, self.xValues.length - self.desiredNumberOfXValues);
    }

    // create the [key:, values: [x:, y:]] datastructure
    var newD3 = [];
    self.d3.forEach(function(d3, j) {
        var o = {key: d3.key, values: []};
        newD3.push(o);
        // for each of the potential x values
        self.xValues.forEach(function(v, i) {
          // if it doesn't exist, add it but with a y of zero
          if(d3.values[v.index] === undefined) {
            o.values.push({x: v.x, y: 0});
          }
          // else, use the x:, y: value as is
          else {
            o.values.push({x: d3.values[v.index].x, y: d3.values[v.index].y});
          }
        });
    });
    return newD3;
  }

  self.setXValues = function(newValue) {

    self.desiredNumberOfXValues = newValue;

  }

  return self;
}

util.inherits(D3Container, EventEmitter)

exports.D3Container = D3Container;