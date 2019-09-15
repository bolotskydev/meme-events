/*
 *Entry point of meme-events
 */

// @TODO: check if it is okay for global inititation instead of local place
// introduce jQuery-like syntax for ease DOM Manipulations inside events modules
import { initiate$ } from './helpers/utils'

// import available memes
import toBeContinuedMemeEvent from './events/toBeContinuedMemeEvent/toBeContinuedMemeEvent'

import creditsMemeEvent from './events/creditsMemeEvent/creditsMemeEvent'

// expose events direct to the window object in case of cdn

;

(() => {
  // @TODO: i don't think that this is good idea to use hidden dep like this one with so huge side effect
  initiate$()

  Object.defineProperties(window, {
    toBeContinuedMemeEvent: {
      value: toBeContinuedMemeEvent,
      writable: false,
    },
    creditsMemeEvent: {
      value: creditsMemeEvent,
      writable: false,
    },
  })
})()

export { toBeContinuedMemeEvent, creditsMemeEvent }
