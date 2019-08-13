/*
 *Entry point of memify
 */

// import available memes 
const titles = require('memes/titles/titles')
const toBeContinued = require('memes/toBeContinued/toBeContinued')

// container
const memify = {}

memify.titles = titles
memify.toBeContinued = toBeContinued


module.exports = memify
