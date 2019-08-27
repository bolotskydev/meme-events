/*
 *Entry point of memify
 */

// import available memes
const toBeContinuedMemeEvent = require('./events/toBeContinuedMemeEvent/toBeContinuedMemeEvent')
const creditsMemeEvent = require('./events/creditsMemeEvent/creditsMemeEvent')

// container
const lib = {}

lib.toBeContinuedMemeEvent = toBeContinuedMemeEvent
lib.creditsMemeEvent = creditsMemeEvent

module.exports = lib
