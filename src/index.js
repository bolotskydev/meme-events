/*
 *Entry point of meme-events
 */

// import available memes
import toBeContinuedMemeEvent from './events/toBeContinuedMemeEvent/toBeContinuedMemeEvent'

import creditsMemeEvent from './events/creditsMemeEvent/creditsMemeEvent'

// expose events direct to the window object in case of cdn
;

(() => {
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
