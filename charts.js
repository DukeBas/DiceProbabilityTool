/**
 * takes a roller or array of rollers and returns chart paramters
 * @param rollers, a single roller or array of roller object
 * @returns chart data as object
 */
function makeChart(rollers){
    // check if we have multiple roller objects
    if (!Array.isArray(rollers)){
        // only one roller, turn it into an array with one roller
        let roller = Object.create(rollers);
        roller = Object.assign(roller, rollers);
        rollers = [];
        rollers.push(roller);
    }

    // add the right parameters for each roller / each line in graph
    // also get lowest non-zero value and max value from probability
    let minIndex = Number.MAX_SAFE_INTEGER; // will always get overridden
    let maxIndex = 0;
    let dataset = [];
    for (let i = 0; i < rollers.length; i++){
        let dataObj ={}

        // label for this roller
        dataObj.label = rollers[i].originalInput;

        // actual probabilities for the roller
        let probability = rollers[i].getProbabilities()
        dataObj.data = probability;

        // get min
        for (let i = 0; i < probability.length; i++){
            if (probability[i] > 0){
                // found first non-zero value
                if (i < minIndex){
                    minIndex = i;
                }
                break;
            }
        }

        // prevent the line bending
        dataObj.lineTension = 0;

        // get max
        let indexLastEntry = probability.length;
        if (indexLastEntry > maxIndex){
            maxIndex = indexLastEntry;
        }

        //TODO line width?
        dataObj.borderWidth = 1;

        dataset.push(dataObj);
    }

    // Generate labeling horizontal axis
    let naming = [];
    for (let i = 0; i < maxIndex; i++){
        naming[i] = i;
    }

    // remove all 0 values
    naming.splice(0, minIndex);
    for (let i = 0; i < rollers.length; i++){
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
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    }

    return chartParams;
}