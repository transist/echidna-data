# Reusable data structures for Echidna

## d3container

Receives {key, x, y}  updates and convert them into a datastructure suitable for display from d3 (and nvd3).

* data structure is organized as an array of objects containing key, values. Values is an array of x,y parameters.
* must track the number of points
* must be able to handle updates out-of-order (x value, timestamp, received in different order)
