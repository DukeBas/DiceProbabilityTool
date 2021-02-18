/**
 * Takes string in standard dice notation and calculates the probability of each possible value
 * that the sum could be after rolling
 * @param input string consisting of modified standard dice notation (see README.md for details)
 * @returns array, where each value is the chance of the index being rolled
 */
function probabilityDistribution(input) {
    // turn the input into a roller object
    let inputAsRoller = new Roller(input);

    // console.log(inputAsRoller);

    // calculate the actual probabilities
    return inputAsRoller.getProbabilities();
}


/**
 * Turns a given occurrences array into a probability array
 * @param occ
 */
function occurrencesToProbabilities(occ){
    // we calculate the probabilities by dividing the amount per index by the total amount
    let total = 0;
    for (let i = 0; i < occ.length; i++){
        total += occ[i];
    }

    // calculate probabilities by doing occurrence per sum divided by the total sum possibilities
    let probabilities = [];
    for (let i = 0; i < occ.length; i++){
        probabilities[i] = occ[i] / total;
    }

    return probabilities;
}

/**
 * Simple recursive function to get the total occurrences of each sum for a set of dice
 * @param dice amount
 * @param sides of dice
 * @returns array, where each value is the chance of the index being rolled
 */
function getOccurrences(dice, sides) {
    let occurrences = [];

    // check if there are dice to roll
    if (dice === 0) {
        return occurrences;
    }

    // recursive part
    if (dice === 1) {
        // get occurrences single dice (trivial)
        occurrences[0] = 0;
        for (let i = 1; i < sides + 1; i++) {
            occurrences[i] = 1;
        }
    } else {
        // more than 1 dice
        // make the occurrences for the first dice in the set
        let firstOccurrences = [];
        for (let i = 1; i < sides + 1; i++) {
            firstOccurrences[i] = 1;
        }

        // get the other set of dices
        let otherOccurrences = getOccurrences(dice - 1, sides);

        occurrences = combineOccurrenceArrays(firstOccurrences, otherOccurrences);
    }
    //TODO custom dice (check type number)

    return occurrences;
}


/**
 * Generates the occurrences for a set of dice that use drop lowest and drop highest by generating all possible scenarios
 * very inefficient
 * @param dice amount
 * @param sides of dice
 * @param dl number of lowest dice to drop
 * @param dh number of highest dice to drop
 * @param arr used in recursion DO NOT SPECIFY IN FIRST CALL
 * @returns array, where each value is the chance of the index being rolled
 */
function getOccurrencesDrop(dice, sides, dl, dh, arr) {
    let occurrences = [];

    // check if there are dice to roll
    if (dice === 0) {
        return occurrences;
    }

    // check if we are in the first call
    if (arr === undefined){
        // we are in the first call
        arr = [];
    }

    // initialize occurrences
    let lenOccurrences = sides * (dice - dl - dh) + 1;
    for (let i = 0; i < lenOccurrences; i++){
        occurrences[i] = 0;
    }

    // console.log(arr)

    // recursively generate arrays to simulate all possible scenarios
    // when the arrays are filled, do the dropping and add the sum for that scenario to occurrence array
    if (arr.length + 1 >= dice){
        // one die left to simulate out of the set

        for (let i = 1; i < sides + 1; i++){
            // calculate the sum of the set of dice with dropping
            let currentArr = arr.slice();
            currentArr.push(i);
            const index = rolledSetDrop(currentArr, dl, dh);
            occurrences[index] += 1;
        }
    } else {
        // more than one dice left to simulate

        // array to hold to occurrence arrays per part of the step
        let parts = [];
        for (let i = 1; i < sides + 1; i++){
            let currentArr = arr.slice();
            currentArr.push(i);
            parts.push(getOccurrencesDrop(dice, sides, dl, dh, currentArr));
        }

        // console.log(parts)

        // sum up all the parts to get the total
        for (let i = 1; i < parts[0].length; i++){
            for (let j = 0; j < parts.length; j++){
                occurrences[i] += parts[j][i];
            }
        }
    }

    return occurrences;
}

/**
 * Given a set of numbers and how many of the lowest to drop and keep, calculate the sum of the dice left
 * @param arr set of input numbers
 * @param dl number of lowest dice to drop
 * @param dh number of highest dice to drop
 * @returns sum (int)
 */
function rolledSetDrop(arr, dl, dh){
    let sum;

    // check if there will be any dice left after drop and keep
    if (dl + dh >= arr.length){
        return sum;
    }

    //first sort the array
    arr.sort(compareNumbers);

    // remove the first dl number of dice and the last dh from array
    const dropped = arr.slice(dl, arr.length - dh);

    // sum up all the values in the array
    sum = dropped.reduce((a, b) => a + b, 0);

    return sum;
}


/**
 * Combines two occurrence arrays
 * @param x occurrence array
 * @param y occurrence array
 * @returns occurrences array, where each value is the chance of the index being rolled
 */
function combineOccurrenceArrays(x, y) {
    let occurrences = [];

    // initialise occurrences array
    const sizeOccurrences = x.length + y.length - 1; // -1 as both arrays start at 0
    for (let i = 0; i < sizeOccurrences; i++) {
        occurrences[i] = 0;
    }

    // add a copy of each occurrence of y to each value of x to get the combined occurrence array
    for (let i = 1; i < x.length; i++) {
        const firstValue = x[i];
        // only do something if we don't have 0 of a sum
        if (firstValue !== 0) {
            // add every sum from the other dice to this particular sum to get new values
            for (let j = 1; j < y.length; j++) {
                const otherValue = y[j];
                // only do something if we don't have 0 of a sum
                if (otherValue !== 0) {
                    // we get a new sum (index) every time we add values
                    const newIndex = i + j;

                    // add it to current occurrences
                    occurrences[newIndex] += firstValue * otherValue;
                }
            }
        }

    }

    return occurrences;
}


/**
 * Object to store a set of dice together with a modifier in
 */
class Roller {
    constructor(input) {
        this.rolls = [];
        this.modifier = 0;
        this.originalInput = input;

        // remove any spaces from the input
        input = input.replace(/\s+/g, '');

        // add a + before -'s so the string can be properly separated into parts
        input = input.replace('-', '+-');

        // separate everything, turning each of the dice parts into it's own thing
        let parts;
        try {
            parts = input.split('+');
        } catch {
            // if the input cannot be turned into parts, fail
            return false;
        }

        // remove empty parts from the array
        parts = parts.filter(Boolean);

        // variable to store location of constructor
        const constr = this;   // for scope

        parts.forEach(function (entry) {
            // check if the entry is not a dice but a modifier
            if (!entry.includes('d')) {
                // modifier found
                constr.modifier += parseInt(entry);
            } else {
                // found dice roll of some kind
                //TODO FIX: RIGHT NOW WE ASSUME THAT THE DICE ROLL IS ALWAYS OF THE FORMAT xdy
                let entrySplit = entry.split("d");

                let dice = entrySplit[0];
                let sides = entrySplit[1];

                //TODO implement custom dice part
                let custom = false
                let customConfig = false

                //TODO implement keep & drop
                // d = drop lowest, dl = drop, dh = drop highest
                let keep = 0;
                let drop = 0;

                let diceObj = {
                    dice: dice,
                    sides: sides,
                    keep: keep,
                    drop: drop,
                    custom: custom,
                    customConfig: customConfig
                };

                constr.rolls.push(diceObj);
            }
        });
    }

    addRoll(x) {
        this.rolls.push(x);
    }

    setModifier(x) {
        this.modifier = x;
    }

    getRolls() {
        return this.rolls;
    }

    getModifier() {
        return this.modifier;
    }

    /**
     * Calculate probability of each sum for our dice set
     * @returns array with probabilities, index indicating the sum
     */
    getProbabilities() {
        // get the dice we want the probability for
        let dice = this.getRolls();

        // we add together the occurrence totals by adding one new roll distribution to the old set
        // per non-zero item in the array, we do this as adding a die is essentially having the same
        // situation as before but then rolling that new die after all the rest are rolled

        // array where each the value of each index indicates how many times out of the total that sum is rolled
        let occurrences = [];

        // combine all different dice rolls together
        if (dice.length > 1){
            // we need to combine multiple types/sets of dice

            let occurrenceSet = [];
            dice.forEach(function (diceSet) {
                const d = parseInt(diceSet.dice);
                const s = parseInt(diceSet.sides);
                occurrenceSet.push(getOccurrences(d, s));
            });

            // combine all the occurrences together
            occurrences = occurrenceSet.reduce(combineOccurrenceArrays);
        } else {
            // single type of dice
            const d = parseInt(dice[0].dice); //amount of dice
            const s = parseInt(dice[0].sides);
            occurrences = getOccurrences(d, s);
        }

        let probabilities = occurrencesToProbabilities(occurrences);

        return probabilities;
    }
}

/**
 * function to compare numbers, for use in sorting arrays of numbers
 */
function compareNumbers(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}
