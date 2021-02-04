function setup() {
  // put setup code here
    var single = getOccurences(1, 6);
    var double = getOccurences(2, 6);
    var triple = getOccurences(3, 6);
    var quad = getOccurences(4, 6);

    console.log(combineOccurrenceArrays(single, double))
    console.log(combineOccurrenceArrays(double, single))
    console.log(triple)
    console.log("--")
}

function draw() {
  // put drawing code here
}