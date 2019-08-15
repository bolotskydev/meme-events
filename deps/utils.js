/*
 *Simple utils library for memify
 */

// utils container

const utils = {}

// simple event stub that logs out any passed msg
// msg: String -> void
utils.eventStub = msg => console.log(msg)

// custom event factory
// (memeName: String, eventType: String, options: Object) -> Event Instance
utils.createEvent = (memeName='MemeEvents', eventType='Default', options = {bubbles: true}) => {
  // create custom events aggregator
  const eventsAggregator = {}
  // create event instance
  eventsAggregator[`${memeName}On${eventType}`] = new CustomEvent(`${memeName}On${eventType}`, options)
  // return event instance 
  return eventsAggregator[`${memeName}On${eventType}`]
}

// receives function and time after which passed fn will be executed
// (fn: Function) -> (time: Number) -> void
utils.delay = fn => time => setTimeout(() => fn(), time)

// same as delay but exposes interface to control fn evaluation passed to delay
// (fn: Function) -> (time: Number) -> Function
utils.delayWithControls = fn => time => {
  // runs delay
  const delay = setTimeout(() => fn(), time)
  // clears delay
  const clearDelay = () => clearTimeout(delay)
  return clearDelay
}

module.exports = utils

