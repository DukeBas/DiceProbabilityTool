/**
 * Takes string in standard dice notation and calculates the probability of each possible value
 * that the sum could be after rolling
 * @param input string consisting of modified standard dice notation (see README.md for details)
 * @returns array, where each value is the chance of the index being rolled
 */
function probabilityDistribution(input) {
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

    // add each individual part to the roller object
    let inputAsRoller = new Roller();
    let modifier = 0;
    parts.forEach(function (entry) {
        // check if the entry is not a dice but a modifier
        if (!entry.includes('d')) {
            // modifier found
            modifier += parseInt(entry);
        } else {
            // dice roll of some kind
            inputAsRoller.addRoll(entry);
        }
    });
    // set all the modifiers together as the cumulative modifier for the roll
    inputAsRoller.setModifier(modifier);

    console.log(inputAsRoller);

    // calculate the actual probabilities
    let probabilities = rollerToProbabilities(inputAsRoller);
    return probabilities;
}


function rollerToProbabilities(roller) {
    let probabilities = probabilityCalcSimple(roller);
    return probabilities;
}


/**
 * First implementation of getting the probabilities, given an input roller object.
 * warning: likely not very efficient
 * @param roller obn
 * @returns array, where each value is the chance of the index being rolled
 */
function probabilityCalcSimple(roller) {
    // array where each the value of each index indicates how many times out of the total that sum is rolled
    let occurrences = [];

    let dice = roller.getRolls();

    // we add together the occurrence totals by adding one new roll distribution to the old set
    // per non-zero item in the array, we do this as adding a die is essentially having the same
    // situation as before but then rolling that new die after all the rest are rolled


    // we calculate the probabilities by dividing the amount per index by the total amount
    let total; //TODO

    return probabilities; //TODO
}

/**
 * Recursive function to get the total occurences of each sum for a set of dice
 * @param dice
 * @param sides
 * @returns array, where each value is the chance of the index being rolled
 */
function getOccurences(dice, sides) {
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
        let otherOccurrences = getOccurences(dice - 1, sides);

        // initialise occurrences array
        let sizeOccurrences = sides * dice + 1; // +1 because arrays start at 0
        for (let i = 0; i < sizeOccurrences; i++) {
            occurrences[i] = 0;
        }

        // then add one copy of each of the set of dice-1 amount of dice to each of possible sums
        for (let i = 1; i < firstOccurrences.length; i++) {
            // add every sum from the other dice to this particular sum to get new values
            for (let j = 1; j < otherOccurrences.length; j++) {
                // only do something if we don't have 0 of a sum
                let otherValue = otherOccurrences[j];
                if (otherValue !== 0) {
                    // we get a new sum (index) every time we add values
                    let newIndex = i + j;

                    // add it to current occurrences
                    occurrences[newIndex] += otherValue;
                }
            }
        }
    }
    //TODO custom dice (check type number)

    return occurrences;
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
        if (firstValue !== 0){
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
    constructor() {
        this.rolls = [];
        this.modifier = 0;
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
}