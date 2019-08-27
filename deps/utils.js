/*
 *Simple utils library for memify
 */

// utils container

const utils = {}

// custom event factory
// (memeName: String, eventType: String, options: Object) -> Event Instance
utils.createEvent = (
  memeName = 'MemeEvents',
  eventType = 'Default',
  options = { bubbles: true }
) => {
  // create custom events aggregator
  const eventsAggregator = {}
  // create event instance
  eventsAggregator[`${memeName}On${eventType}`] = new CustomEvent(
    `${memeName}On${eventType}`,
    options
  )
  // return event instance
  return eventsAggregator[`${memeName}On${eventType}`]
}

// receives function arg and time arg after which passed fn arg will be executed
// (fn: Function) -> (time: Number) -> void
utils.delay = fn => time => setTimeout(() => fn(), time)

// same as delay but returns back a fn that could clear delay
// (fn: Function) -> (time: Number) -> Function
utils.delayWithControls = fn => time => {
  // runs delay
  const delay = setTimeout(() => fn(), time)
  // clears delay
  const clearDelay = () => clearTimeout(delay)
  return clearDelay
}

module.exports = utils
