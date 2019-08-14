/*
 *Simple utils library for memify
 */

// utils container

const utils = {}

// simple event stub that logs out any passed msg
// msg: String -> void
utils.eventStub = msg => console.log(msg)


// event factory, exposes onStart and onFinish custom events for any given meme
// (memeName: String, clearUpFn: Function, fnOnFinish: Function) -> Object { CustomEventOnFinish, CustomEventOnStart} 
utils.createEvents = (memeName, clearUpFn, fnOnFinish ) => {
  // create custom events aggregator
  const eventsAggregator = {}
  // create instances of custom event api
  eventsAggregator[`${memeName}OnStart`]= new CustomEvent(`${memeName}OnStart`, {
    bubbles: true,
    detail: {
      terminate: () => {
        console.log('Caught terminate call!')
        // terminate meme at any point between start and finish 
        clearUpFn()
        // dispatch finish event
        document.body.dispatchEvent(eventsAggregator[`${memeName}OnFinish`]) 
        // run optional onFinish fn
        fnOnFinish && fnOnFinish()
      } 
    }
  })
  eventsAggregator[`${memeName}OnFinish`]= new CustomEvent(`${memeName}OnFinish`, {
    bubbles: true
  })
  return eventsAggregator 
}

module.exports = utils
