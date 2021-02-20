/**
 * takes a roller or array of rollers and returns chart paramters
 * @param rollers, a single roller or array of roller object
 * @param options, object with possible graph options. Options:
 *      percentage          (= true)
 *      precision           (= 3)
 *      startY-axisAt0      (= true)
 *      EndY-axisAt1        (= false)
 *
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
        if (options.scales === undefined) {
            options.scales = defaultChartOptions.scales;
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

        //TODO line width?
        dataObj.borderWidth = 1;

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

// default chart options
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
    }
}
