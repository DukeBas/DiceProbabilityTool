/**
 * function called when body has been loaded
 */
function init(){
    // creating chart
    let ctx = document.getElementById('canvas').getContext('2d');

    //TODO don't show 0s at the beginning

    //temp
    let testInput = "2d6"
    let roller = new Roller(testInput);

    var chart = new Chart(ctx, makeChart(roller));
}