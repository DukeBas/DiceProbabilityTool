//

var single = getOccurrences(1, 6);
var double = getOccurrences(2, 6);
var triple = getOccurrences(3, 6);
var quad = getOccurrences(4, 6);

console.log(probabilityDistribution("2d20-2+3+1d4"));
console.log(occurrencesToProbabilities(getOccurrencesDrop(2, 20, 1, 0)));
console.log(occurrencesToProbabilities(getOccurrencesDrop(3, 20, 2, 0)));
