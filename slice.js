'use strict';

function Slice(data) {
    var self = this;
    self.values = null;
    self.timestamp = null;
    if(data) {
      var other = JSON.parse(data);
      self.values = other.values;
      self.timestamp = other.timestamp;
    }
    self.addValue = function(word, count, source, panel) {
      if(self.values === null)
        self.values = [];
      self.values.push({word:word, count:count, source:source, panel:panel});
    };
    self.setTimestamp = function(timestamp) {
      self.timestamp = timestamp;
    };

    self.equals = function(other) {
      self.checkValid();
      other.checkValid();

      if(self.timestamp !== other.timestamp)
        return false;
      if(self.values.length !== other.values.length)
        return false;

      for(var v in self.values) {
        if(self.values[v].word !== other.values[v].word)
          return false;
        if(self.values[v].count !== other.values[v].count)
          return false;
        if(self.values[v].source !== other.values[v].source)
          return false;
        if(self.values[v].panel !== other.values[v].panel)
          return false;
      }

      return true;
    };

    self.checkValid = function() {
      if(!self.values instanceof Array)
        throw new Error('Values should be array');
      if(!self.timestamp instanceof String)
        throw new Error('Timestamp should be string');
    };

    self.toJSON = function() {
      self.checkValid();
      return JSON.stringify({
        timestamp: self.timestamp,
        values: self.values
      });
    }

    return self;
}

exports.Slice = Slice;