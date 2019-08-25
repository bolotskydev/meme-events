/*
 *Entry point of memify
 */

// import available memes 
const toBeContinuedMemEvent = require('./memes/toBeContinuedMemEvent/toBeContinuedMemEvent')
const creditsMemEvent = require('./memes/credits/creditsMemEvent')

// container
const lib = {}

lib.toBeContinuedMemEvent = toBeContinuedMemEvent
lib.creditsMemEvent = creditsMemEvent


module.exports = lib
