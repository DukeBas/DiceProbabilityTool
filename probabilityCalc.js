/**
 * Takes string in standard dice notation and calculates the probability of each possible value
 * that the sum could be after rolling
 * @param input string consisting of modified standard dice notation (see README.md for details)
 * @returns object, dictionary for each value it's probability, returns false if it fails
 */
function probabilityDistribution (input){
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
    parts.forEach( function(entry){
        // check if the entry is not a dice but a modifier
        if (!entry.includes('d')){
            // modifier found
            modifier += parseInt(entry);
        } else {
            // dice roll of some kind
            inputAsRoller.addRoll(entry);
        }
    });
    // set all the modifiers together as the cumulative modifier for the roll
    inputAsRoller.setModifier(modifier);

    return inputAsRoller;

    // calculate the actual probabilities
    let probabilities = rollerToProbabilities(inputAsRoller);
    return probabilities;
}



function rollerToProbabilities (roller) {
    let probabilities = rollerToProbabilitiesSimple(roller);
    return probabilities;
}



/**
 * First implementation of getting the probabilities, given an input roller object.
 * warning: likely very inefficient
 * @param roller
 * @returns object, dictionary for each value it's probability, returns false if it fails
 */
function probabilityCalcSimple (roller) {
    let probabilities = {};

    return probabilities;
}



/**
 * Object to store a set of dice together with a modifier in
 */
class Roller {
    constructor() {
        this.rolls = [];
        this.modifier = 0;
    }

    addRoll (x){
        this.rolls.push(x);
    }

    setModifier (x){
        this.modifier = x;
    }

    getDice(){
        return this.dice;
    }

    getModifier(){
        return this.modifier;
    }
}