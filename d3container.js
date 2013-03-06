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
  // x is timestamp
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
      self.update(v.word, s.getTime(), v.count);
    }
  };

  self.current = function() {
    self.xValues.sort(function(a,b) {
      return a.x - b.x;
    });

    if(self.desiredNumberOfXValues && self.xValues.length > self.desiredNumberOfXValues) {
      self.xValues.splice(0, self.xValues.length - self.desiredNumberOfXValues);
    }

    var newD3 = [];
    self.d3.forEach(function(d3, j) {
        var o = {key: d3.key, values: []};
        newD3.push(o);
        self.xValues.forEach(function(v, i) {
          if(d3.values[v.index] === undefined)
            o.values.push({x: v.x, y: 0});
          else
            o.values.push(d3.values[v.index]);
        });
    });
    return newD3;
    //return self.d3;
  }

  self.setXValues = function(newValue) {

    self.desiredNumberOfXValues = newValue;

  }

  return self;
}

util.inherits(D3Container, EventEmitter)

exports.D3Container = D3Container;