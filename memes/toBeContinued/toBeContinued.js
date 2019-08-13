/*
 *CSS & JS version of toBeContinued meme from JoJo
 *origin: https://www.youtube.com/watch?v=70syHNphIQg
 */

// deps
const utils = require('../../deps/utils')

// function that assumes to be passed to addEventListener, triggers toBeContinued meme
// (e: event obj, {fnOnStart: Function, fnOnFinish: Function) -> void
const toBeContinued = (e, { fnOnStart = () => utils.eventStub('Meme has been started'), fnOnFinish = () => utils.eventStub('Meme has been finished')} = {}) => {
  // get custom events
  const [toBeContinuedOnStart, toBeContinuedOnFinish] = createEvents(fnOnTerminate, fnOnStart, fnOnFinish)
  // dispatch custom event toBeContinuedStart
  e.target.dispatchEvent(toBeContinuedOnStart)
  // run meme
  toBeContinuedRun()
  // clear everything up
  toBeContinudClearUp()
  // dispatch custom event toBeContinuedOnFinish
  e.target.dispatchEvent(toBeContinuedOnFinish) 
  // run optional onFinish fn
  fnOnFinish && fnOnFinish()
}

// toBeContinued Helper Functions

// run meme
const toBeContinuedRun = () => {
  console.log('Show time!')
}

// remove meme
const toBeContinuedClearUp = () => {
  console.log("Cleared up!")
} 

// event factory, exposes onStart and onFinish custom events for toBeContinued
// fnOnFinish: Function -> Tuple[toBeContinuedOnStart: CustomEvent, toBeContinuedOnFinish: CustomEvent]
const createEvents = fnOnFinish => {
  // create instances of custom event api
  const toBeContinuedOnStart = new CustomEvent('toBeContinuedOnStart', {
    bubbles: true,
    detail: {
      terminate: () => {
        // terminate meme at any point between start and finish 
        toBeContinuedClearUp()
        // dispatch finish event
        e.target.dispatchEvent(toBeContinuedFinish) 
        // run optional onFinish fn
        fnOnFinish && fnOnFinish()
      } 
    }
  })
  const toBeContinuedOnFinish = new CustomEvent('toBeContinuedOnFinish', {
    bubbles: true,
  })
  return [toBeContinuedOnStart, toBeContinuedOnFinish]
}

module.exports = toBeContinued
