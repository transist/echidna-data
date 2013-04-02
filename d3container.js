"use strict";

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var slice = require('./slice.js');
var moment = require('moment');

// D3Container maintains an object that looks as follows:
// [{key: KEYNAME1, values: [{x, y}]}, {key: KEYNAME2, values: [{x, y}]}, ...]
// condition:
// - every values has the same list of x in the same order for every key
// for our needs,
// key is word, x is time and y is count
function D3Container(object, desiredNumberOfXValues) {
  var self = this;

  self.keys = object;
  self.desiredNumberOfXValues = desiredNumberOfXValues;

  // key is word
  // x is timestamp in unix time
  // y is count
  // function must:
  // - add or update the x, y pair to the values associated to the key
  // - make sure that every other key also has the same x value
  // - trim the list and remove older values if they are not in use
  self.update = function(key, x, y) {
    var keyIndex = self._getKeyIndex(key);
    // inside the key object, we can find the index
    var xIndex = self._getXIndex(x);

    //this is either an update or initing the newly created value
    self.addXValue(x, xIndex);

    // index is resorted so we need to retrieve the latest index
    xIndex = self._getXIndex(x);

    // set the actual y value
    self.keys[keyIndex].values[xIndex].y = y;

    // update always EXCEPT when we haven't reached the number of desired values
    if(!self.desiredNumberOfXValues || self.keys[0].values.length >= self.desiredNumberOfXValues) {
      this.emit('updated');
    }
  };

  self.addXValue = function(x, xIndex) {
    for(var k in self.keys) {
      var keyObject = self.keys[k];
      if(!keyObject.values[xIndex]) {
        keyObject.values[xIndex] = {x:x, y:0};
      }

      if(self.desiredNumberOfXValues && keyObject.values.length > self.desiredNumberOfXValues) {
        var lastIndexRemoved = keyObject.values.length - self.desiredNumberOfXValues;
        keyObject.values.splice(0, lastIndexRemoved);
      }
      // resort all every time
      keyObject.values.sort(function(a, b) {
        return a.x - b.x;
      });
    }

    //console.log(JSON.stringify(self.keys));
    // we've resorted the values, now resort index
    var i = 0;
    for(var v in self.keys[0].values) {
      var value = self.keys[0].values[v];
      self.xToIndex[value.x] = i;
      i++;
    }
    //console.log(JSON.stringify(self.xToIndex));

  }

  self.updateSlice = function(s) {
    if(!(s instanceof slice.Slice))
      throw new Error('not a slice');
    // we use moment instead of Date.parse as the
    // moment parser is more forgiving and accepts
    // partial timestamp such as 2013-03-12T01
    var unixTime = moment(s.getTime()).valueOf();
    if(s.words.length > 0) {
      var v;
      while(v = s.next()) {
        self.update(v.word, unixTime, v.count);
      }
    } else {
      // we have no words for this time value, but we still want
      // to keep track of the timestamp so that we have no "holes"
      var xIndex = self._getXIndex(unixTime);
      self.addXValue(unixTime, xIndex);
    }
  };

  self.reset = function() {
    // remove all values
    self.keys.splice(0);
    self._init();
  };

  self._init = function() {
    self.keyToIndex = {};
    self.xToIndex = {};
    self.maxIndex = 0;
  };

  self._addNewKey = function(key) {
    if(self.keyToIndex[key] !== undefined) {
      throw new Error('Trying to add existing key ' + key);
    }

    // before we actually add it, length is equal to future index
    self.keyToIndex[key] = self.keys.length;
    var newKeyObject = {key: key, values: []};
    // initialize to a copy of X values from the first object
    if(self.keys[0] !== undefined) {
      for(var v in self.keys[0].values) {
        var x = self.keys[0].values[v].x;
        newKeyObject.values.push({x:x, y:0});
      }
    }

    self.keys.push(newKeyObject);
  }

  self._getKeyIndex = function(key) {
    // if the key does not exist, create the empty object and initialize
    if(self.keyToIndex[key] === undefined) {
      self._addNewKey(key);
    }
    // either it already existed or we just initialized it with addNewKey
    return self.keyToIndex[key];
  };

  self._getXIndex = function(x) {
    if(self.xToIndex[x] === undefined) {
      self.xToIndex[x] = self.maxIndex++;
    }
    return self.xToIndex[x];
  };

  // NEW OBJECT INSTRUCTIONS
  if(!(object instanceof Array)) {
    throw new Error('first parameter should be a reference to an array');
  }

  self._init();

  return self;
}

util.inherits(D3Container, EventEmitter)

exports.D3Container = D3Container;