/**
 * function called when body has been loaded
 */
function init(){
    // for testing
    // addGraphInput("1d20");
    // addGraphInput("2d10");
    // addGraphInput("5d4");
    addGraphInput("3d6");
    addGraphInput("4d6d1");

    // add first empty input
    addGraphInput();

    // make the first chart
    goChart();
}