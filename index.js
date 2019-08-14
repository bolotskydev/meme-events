/*
 *Entry point of memify
 */

// import available memes 
const toBeContinued = require('./memes/toBeContinued/toBeContinued')

// container
const memify = {}

memify.toBeContinued = toBeContinued


module.exports = memify
