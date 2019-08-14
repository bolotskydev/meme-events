/*
 *Simple utils library for memify
 */

// utils container

const utils = {}

// simple event stub that logs out any passed msg
// msg: String -> void
utils.eventStub = msg => console.log(msg)


// event factory, exposes onStart and onFinish custom events for any given meme
// (memeName: String, fnTerminate: Function) -> Object { CustomEventOnFinish, CustomEventOnStart} 
utils.createEvents = (memeName, fnTerminate) => {
  // create custom events aggregator
  const eventsAggregator = {}
  // create instances of custom event api
  eventsAggregator[`${memeName}OnFinish`]= new CustomEvent(`${memeName}OnFinish`, {
    bubbles: true
  })
  eventsAggregator[`${memeName}OnStart`]= new CustomEvent(`${memeName}OnStart`, {
    bubbles: true,
    detail: {
      terminate: fnTerminate(eventsAggregator[`${memeName}OnFinish`]) 
    }
  })
  return eventsAggregator 
}

// receives function and time after which passed fn will be executed
// (fn: Function) -> (time: Number) -> void
utils.delay = fn => time => setTimeout(() => fn(), time)

module.exports = utils
