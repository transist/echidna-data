# Reusable data structures for Echidna

## D3Container.js

Receives {key, x, y}  updates and convert them into a datastructure suitable for display from d3 and nvd3.

* data structure is organized as an array of objects containing key, values. Values is an array of x,y parameters.
* must track the number of points
* must be able to handle updates out-of-order (x value, timestamp, received in different order)

(See samples/nvd3-sample.json for output data structure)


## FeedConfig.js

Used to handle feed paramaters between client and server

## Use it in the browser

You need to use [Browserify node module](https://github.com/substack/node-browserify) to turn d3 container & FeedConfig into sth usable by the browser.

    npm install
    bash browserify.sh

## faker.js

faker.js is a set of functions to generate data for stream from a FeedConfig object

    var faker = require("faker");
    var slice = faker.newSlice(feedconfig);

# List of fake keywords

To update the list :

1) Update in this [Google Spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0ArNEXxu0b66PdHdkZHJqcFpubUlrNGlZQ3d3Sk55R0E#gid=1)
    
2) Downloaded both sheets as CSV into ./faker/random_words_sheet1.csv and ./faker/random_words_sheet2.csv

3) Rebuild keywords.json using the following command :

    node build_faker_keywords.js

During the build, the function will provide stats about the length of the list for each panel