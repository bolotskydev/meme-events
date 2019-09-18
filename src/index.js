/*
 *Entry point of meme-events
 */

// import available memes
// eslint-disable-next-line import/no-named-as-default
import toBeContinuedMemeEvent from './events/toBeContinuedMemeEvent/toBeContinuedMemeEvent'

// eslint-disable-next-line import/no-named-as-default
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
