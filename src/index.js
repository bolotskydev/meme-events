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

// arrgents into sets
const toBeContinuedSet = {
  event: toBeContinuedMemeEvent,
  styles: toBeContinuedStyles,
}
const creditsSet = {
  event: creditsMemeEvent,
  styles: creditsStyles,
}

export { toBeContinuedSet, creditsSet }
