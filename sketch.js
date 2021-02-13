function setup() {
  // put setup code here
    var single = getOccurrences(1, 6);
    var double = getOccurrences(2, 6);
    var triple = getOccurrences(3, 6);
    var quad = getOccurrences(4, 6);

    console.log(probabilityDistribution("2d20-2+3+1d4"));
    console.log(getOccurrencesDrop(2,4,0,0));
    console.log(getOccurrencesDrop(2,4,1,0));
    console.log(getOccurrencesDrop(2,4,0,1));
    console.log(getOccurrencesDrop(2,4,1,1));
}

function draw() {
  // put drawing code here
}