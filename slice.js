'use strict';

function Slice(data) {
    var self = this;
    self.words = [];
    self.time = null;
    if(data) {
      var other;
      if(typeof data === 'string')
        other = JSON.parse(data);
      else if(typeof data === 'object')
        other = data;
      else
        throw new Error('Unsupported data type ' + typeof data);

      self.words = other.words;
      self.time = other.time;
    }

    self.addValue = function(word, count, source, panel) {
      if(self.words === null)
        self.words = [];
      self.words.push({word:word, count:count, source:source, panel:panel});
    };

    self.setTime = function(t) {
      if(typeof t !== 'string')
        throw new Error('time should be stored as ISO8601 string, is ' + typeof t);
      self.time = t;
    };

    self.getTime = function(t) {
      return self.time;
    };

    self.equals = function(other) {
      self.checkValid();
      other.checkValid();

      if(self.time !== other.time)
        return false;
      if(self.words.length !== other.words.length)
        return false;

      for(var v in self.words) {
        if(self.words[v].word !== other.words[v].word)
          return false;
        if(self.words[v].count !== other.words[v].count)
          return false;
        if(self.words[v].source !== other.words[v].source)
          return false;
        if(self.words[v].panel !== other.words[v].panel)
          return false;
      }

      return true;
    };

    self.checkValid = function() {
      if(!(self.words instanceof Array))
        throw new Error('Values should be array, is ' + self.words);
      if(!(typeof self.time === 'string'))
        throw new Error('Timestamp should be string, is: ' + self.time);
      //in some cases, we may indeed have no words
      //if((self.words.length === 0))
      //  throw new Error('Empty array of words ');
    };

    self.toJSON = function() {
      self.checkValid();
      return JSON.stringify({
        time: self.time,
        words: self.words
      });
    }

    self.next = function() {
      return self.words.pop();
    };

    return self;
}

exports.Slice = Slice;