# Reusable data structures for Echidna

## d3container

Receives {key, x, y}  updates and convert them into a datastructure suitable for display from d3 (and nvd3).

* data structure is organized as an array of objects containing key, values. Values is an array of x,y parameters.
* must track the number of points
* must be able to handle updates out-of-order (x value, timestamp, received in different order)


## Use it in the browser

You need to use [Browserify node module](https://github.com/substack/node-browserify) to turn d3 container script into sth usable by the browser.

    npm install
    bash browserify.sh

## faker.js

faker.js is a set of functions to generate data for stream

    var dataGenerator = require("faker");
    var slice = dataGenerator.newSlice(5,1,false)[0];
    var stream = dataGenerator.fakeInitStream(5,30);


Generate one slice

    newSlice(numberItems, streamLength, init)
    
        - numberItems   : Integer   how many keywords fo you want
        - streamLength  : Integer   how many values per keywords
        - init          : Boolean   - true  : fake timestamp
                                    - false : use Date.now()


Parse x slices into a stream array formatted for nvd3

    fakeInitStream ( numberItems, streamLength ) 
    
        - numberItems   : Integer   how many keywords fo you want
        - streamLength  : Integer   how many values per keywords


DATA STRUCTURE

    "keywords" : [
          {
              "keyword": "<KEYWORD>",
              "sliceid" : "<TIMESTAMP X>"
              "count" : "<X FOR TIME PERIOD>",
              "samplesrcid": "<POST ID FROM WEIBO>",
          },
          {
              // second keyword
          }
    ]
