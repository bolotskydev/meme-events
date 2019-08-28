/*
 *Entry point of meme-events
 */

// import available memes
import {
  toBeContinuedMemeEvent,
  toBeContinuedStyles,
} from './events/toBeContinuedMemeEvent/toBeContinuedMemeEvent'

import {
  creditsMemeEvent,
  creditsStyles,
} from './events/creditsMemeEvent/creditsMemeEvent'

// arrange into sets for useful chunky export
const toBeContinuedSet = {
  event: toBeContinuedMemeEvent,
  styles: toBeContinuedStyles,
}
const creditsSet = {
  event: creditsMemeEvent,
  styles: creditsStyles,
}

export { toBeContinuedSet, creditsSet }
