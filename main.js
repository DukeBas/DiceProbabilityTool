/**
 * function called when body has been loaded
 */
function init(){
    // creating chart
    let ctx = document.getElementById('canvas').getContext('2d');

    //temp
    let testInput = [new Roller("1d20"), new Roller("2d10"), new Roller("5d4")];
    // let testInput = [new Roller("100d100")];

    var chart = new Chart(ctx, makeChart(testInput));
}