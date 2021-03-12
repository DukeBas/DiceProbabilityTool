/**
 * function called when body has been loaded
 */
function init() {
    addGraphInput("3d6");
    addGraphInput("4d6d1", "4d6 Drop the lowest");


    // add first empty input
    addGraphInput();

    // make the first chart
    goChart();
}