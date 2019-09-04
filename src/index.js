/*
 *Entry point of meme-events
 */

// @TODO: check if it is okay for global inititation
// introduce jQuery-like syntax for ease DOM Manipulations inside events modules
import { initiate$ } from './helpers/utils'

// import available memes
import toBeContinuedMemeEventSet from './events/toBeContinuedMemeEvent/toBeContinuedMemeEvent'

import creditsMemeEventSet from './events/creditsMemeEvent/creditsMemeEvent'

initiate$()

export { toBeContinuedMemeEventSet, creditsMemeEventSet }
