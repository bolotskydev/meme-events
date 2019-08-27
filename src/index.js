/*
 *Entry point of memify
 */

// import available memes
const toBeContinuedMemeEvent = require('./events/toBeContinuedMemeEvent/toBeContinuedMemeEvent')
const creditsMemeEvent = require('./events/creditsMemeEvent/creditsMemeEvent')

export default {
  toBeContinuedMemeEvent,
  creditsMemeEvent
} 
