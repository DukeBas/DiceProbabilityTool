function makeChart(rollers){
    // if one or array




    //TODO get min value from all the sets

    //TODO get max value out of all the sets

    //TODO create labels

    //temp solution
    let probability = rollers.getProbabilities();
    let naming = [];
    for (let i = 0; i < probability.length; i++){
        naming[i] = i;
    }

    let chartParams = {
        type: 'line',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: naming,
            datasets: [{
                label: 'calc',
                data: probability,
                // data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }
            ]
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