/*
 *Entry point of meme-events
 */

// @TODO: check if it is okay for global inititation
// introduce jQuery-like syntax for ease DOM Manipulations inside events modules
import { initiate$ } from './helpers/utils'

// import available memes
import toBeContinuedMemeEvent from './events/toBeContinuedMemeEvent/toBeContinuedMemeEvent'

import creditsMemeEvent from './events/creditsMemeEvent/creditsMemeEvent'

// expose events direct to the window object in case of cdn

;

(() => {
  initiate$()

  Object.defineProperties({
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
