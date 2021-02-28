// global variable for the chart
let chart;

/**
 * takes a roller or array of rollers and returns chart paramters
 * @param rollers, a single roller or array of roller object
 * @param options, object with possible graph options. Options:
 *      percentage          (= true)
 *      precision           (= 3)
 *      startYaxisAt0      (= true)
 * @returns chart data as object
 */
function makeChart(rollers, options) {
    // check if we have multiple roller objects
    if (!Array.isArray(rollers)) {
        // only one roller, turn it into an array with one roller
        let roller = Object.create(rollers);
        roller = Object.assign(roller, rollers);
        rollers = [];
        rollers.push(roller);
    }


    // define our chart options
    if (options === undefined) {
        // no options were given, set all to default
        options = {};
        options.scales = defaultChartOptions.scales;
        options.percentage = defaultChartOptions.percentage;
        options.precision = defaultChartOptions.precision;
        options.tooltips = defaultChartOptions.tooltips;
    } else {
        // at least some options were given
        // check for each option if a value was defined, else go to some default value
        if (options.startYaxisAt0 === undefined) {
            options.scales = {
                yAxes: [{
                    ticks: {
                        beginAtZero: defaultChartOptions.scales.yAxes[0].ticks.beginAtZero,
                    }
                }]
            }
        } else {
            options.scales = {
                yAxes: [{
                    ticks: {
                        beginAtZero: options.startYaxisAt0,
                    }
                }]
            }
        }

        if (options.percentage === undefined) {
            options.percentage = defaultChartOptions.percentage;
        }
        if (options.precision === undefined) {
            options.precision = defaultChartOptions.precision;
        }
        if (options.tooltips === undefined) {
            options.tooltips = defaultChartOptions.tooltips;
        }

        // add percentage signs y-axis
        if (options.percentage) {
            options.scales.yAxes[0].ticks.callback = defaultChartOptions.scales.yAxes[0].ticks.callback;
        }
    }
    // options we always want
    options.responsive = true;  // scales with div
    options.maintainAspectRatio = false;  // scales with div


    // add the right parameters for each roller / each line in graph
    // also get lowest non-zero value and max value from probability
    let minIndex = Number.MAX_SAFE_INTEGER; // will always get overridden
    let maxIndex = 0;
    let dataset = [];

    for (let i = 0; i < rollers.length; i++) {
        let dataObj = {}

        // label for this roller
        dataObj.label = rollers[i].originalInput;

        // actual probabilities for the roller
        let probability = rollers[i].getProbabilities(options.percentage, options.precision);
        dataObj.data = probability;

        // get first non-zero value from all probabilities
        for (let i = 0; i < probability.length; i++) {
            if (probability[i] > 0) {
                // found first non-zero value
                if (i < minIndex) {
                    minIndex = i;
                }
                break;
            }
        }

        // prevent the line bending
        dataObj.lineTension = 0;

        // get maximum value from all probabilities
        let indexLastEntry = probability.length;
        if (indexLastEntry > maxIndex) {
            maxIndex = indexLastEntry;
        }

        dataObj.borderWidth = 1;
        let col = rollers[i].getColor();
        dataObj.borderColor = col;
        dataObj.fill = true;
        dataObj.backgroundColor = hexToRGB(col, 0.3);

        dataset.push(dataObj);
    }

    // Generate labeling horizontal axis
    let naming = [];
    for (let i = 0; i < maxIndex; i++) {
        naming[i] = i;
    }

    // remove all 0 values
    naming.splice(0, minIndex);
    for (let i = 0; i < rollers.length; i++) {
        dataset[i].data.splice(0, minIndex);
    }

    let chartParams = {
        type: 'line',
        data: {
            labels: naming,
            // datasets: [{
            //     label: 'calc',
            //     data: probability,
            //     borderWidth: 1
            // }
            // ]
            datasets: dataset
        },
        options: options
        // options: {
        //     scales: {
        //         yAxes: [{
        //             ticks: {
        //                 beginAtZero: true
        //             }
        //         }]
        //     },
        //     responsive: true,
        //     maintainAspectRatio: false
        // }
    }

    return chartParams;
}

// default chart options for when certain options are not defined
let defaultChartOptions = {
    percentage: true,
    precision: 2,
    // y-axis always starts at 0 and % on y-axis
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                callback: function (value) {
                    return (value + " %");
                },
            }
        }]
    },
    // for percentage sign
    tooltips: {
        callbacks: {
            label: function (tooltip, data) {
                return (Chart.defaults.global.tooltips.callbacks.label(tooltip, data) + " %");
            }
        }
    },
}

/**
 * Adds a field to the Graph input on the HTML
 */
function addGraphInput(input) {
    let newElement = document.createElement('div');
    newElement.className = "inputBox";

    // color input
    let colorpicker = document.createElement('input');
    colorpicker.type = "color";
    // generate random color //TODO have list of colors to pick from
    let randCol = randomHexColor();
    colorpicker.value = randCol;
    colorpicker.id = "color";
    colorpicker.addEventListener("change", goChart, false);
    newElement.append(colorpicker);

    // input field for dice
    let inputField = document.createElement('input');
    inputField.id = "diceInput";
    // add a value to the input field if it was given
    if (input !== undefined) {
        inputField.value = input;
    }
    // make sure chart is updated with new input
    inputField.addEventListener("blur", goChart);
    newElement.append(inputField);


    // button to delete the div
    let deleteButton = document.createElement('button');
    deleteButton.innerText = "Del"
    deleteButton.onclick = function () {
        newElement.remove();
        goChart(); //update chart
    }
    newElement.append(deleteButton);

    // find the list of graphInputs on the page
    let graphInputs = document.getElementById("graphInputs");

    // add our new item to that list
    graphInputs.append(newElement);
}

/**
 * Get all the values from the possible graph/dice inputs and put them in roller format
 * @returns {[]} roller format
 */
function getAllDiceInputs() {
    let rollers = [];

    // let inputs = document.getElementsByClassName("diceInput");
    // for (let i = 0; i < inputs.length; i++) {
    //     let inp = inputs[i].value;
    //     // only look at non-empty fields
    //     if (Boolean(inp)) {
    //         let roller = new Roller(inputs[i].value);
    //         if (roller.getValidity()) {
    //             rollers.push(new Roller(inputs[i].value));
    //         }
    //     }
    // }

    let inputs = document.getElementsByClassName("inputBox");
    for (let i = 0; i < inputs.length; i++) {
        let inputBox = inputs[i];

        // find input field and get it's value
        let inputField;
        for (let i = 0; i < inputBox.children.length; i++){
            if (inputBox.children[i].id === "diceInput") {
                inputField = inputBox.children[i];
            }
        }
        let diceInput = inputField.value;

        // get color
        let colorPick;
        for (let i = 0; i < inputBox.children.length; i++){
            if (inputBox.children[i].id === "color") {
                colorPick = inputBox.children[i];
            }
        }
        let color = colorPick.value;

        // only look at non-empty fields
        if (Boolean(diceInput)) {
            let roller = new Roller(diceInput);
            roller.setColor(color);
            if (roller.getValidity()) {
                rollers.push(roller);
            }
        }

    //     // only look at non-empty fields
    //     if (Boolean(inp)) {
    //         let roller = new Roller(inputs[i].value);
    //         if (roller.getValidity()) {
    //             rollers.push(new Roller(inputs[i].value));
    //         }
    //     }
    }

    return rollers;
}

/**
 * Collects all dice and puts the appropriate chart on the page
 */
function goChart() {
    let inputs = getAllDiceInputs();

    //TODO get options
    let options = {}

    if (chart === undefined) {
        // first iteration, create new chart
        // find where to place chart
        let ctx = document.getElementById('canvas').getContext('2d');
        chart = new Chart(ctx, makeChart(inputs));
    } else {
        // update chart with new configuration
        chart.config = makeChart(inputs);
        chart.update();
    }
}

/**
 * @returns random color in hex format as string
 */
function randomHexColor() {
    let randCol = "#";
    let charSet = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A", "B", "C", "D", "E", "F"];
    for (let i = 0; i < 6; i++) {
        randCol += charSet[Math.floor(Math.random()*charSet.length)];
    }
    return randCol;
}

/**
 * Turns a given hex color into the same color but in rgb format with possible opacity extra
 * @param hex
 * @param opacity
 * @returns color as rgb(a)
 */
function hexToRGB(hex, opacity) {
    let rgb = "rgb(";

    // remove #
    hex = hex.substring(1);

    // red
    let r = hex.slice(0, 2);
    rgb += parseInt(r, 16);
    rgb += ", ";

    // green
    let g = hex.slice(2, 4);
    rgb += parseInt(g, 16);
    rgb += ", ";

    // blue
    let b = hex.slice(4, 6);
    rgb += parseInt(b, 16);

    // add opacity if it was specified
    if (opacity !== undefined){
        rgb += ", ";
        rgb += opacity;
    }

    rgb += ")"
    return rgb;
}