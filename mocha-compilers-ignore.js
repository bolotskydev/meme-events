// make a stub for handling case with wrong ext
const { addHook } = require('pirates')

const IGNORE_EXTS = ['.scss', '.css', '.mp3']

addHook((code, filename) => '', { exts: IGNORE_EXTS })
