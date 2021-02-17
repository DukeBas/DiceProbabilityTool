//

var single = getOccurrences(1, 6);
var double = getOccurrences(2, 6);
var triple = getOccurrences(3, 6);
var quad = getOccurrences(4, 6);

console.log(probabilityDistribution("2d20-2+3+1d4"));
console.log(occurrencesToProbabilities(getOccurrencesDrop(2, 20, 1, 0)));
console.log(occurrencesToProbabilities(getOccurrencesDrop(3, 20, 2, 0)));

/**
 * function called when body has been loaded
 */
function init(){
    // creating chart
    let ctx = document.getElementById('canvas').getContext('2d');

    // temp code for tesing
    let naming = [];
    let temp = occurrencesToProbabilities(getOccurrencesDrop(2, 20, 1, 0));
    for (let i = 0; i < temp.length; i++){
        naming.push(i);
    }
    console.log(naming)

    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: naming,
            datasets: [{
                label: '# of Votes',
                data: temp,
                // data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}