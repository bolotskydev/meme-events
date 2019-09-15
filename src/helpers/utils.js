/*
 * Simple utils library for meme-events
 */

// custom event factory
// (memeName: String, eventType: String, options: Object) -> Event Instance
export const createEvent = (
  memeName = 'MemeEvent',
  eventType = 'Default',
  options = { bubbles: true }
) => new CustomEvent(`${memeName}On${eventType}`, options)

// receives function arg and time arg after which passed fn arg will be executed
// (fn: Function) -> (time: Number) -> void
export const delay = fn => time => setTimeout(() => fn(), time)

// same as delay but returns back a fn that could clear delay
// (fn: Function) -> (time: Number) -> Function
export const delayWithControls = fn => time => {
  // runs delay
  const delayInitiate = setTimeout(() => fn(), time)
  // clears delay
  const clearDelayInitiate = () => clearTimeout(delayInitiate)
  return clearDelayInitiate
}

// takes an css selector and removes it from its parent
// removeNode(toBeRemoved: String | Node) -> void
export const removeNode = (toBeRemoved = '__dontexist__') => {
  let temp = toBeRemoved
  if (typeof temp === 'string' && temp.length > 0) {
    temp = document.querySelector(temp)
    temp && temp.parentNode.removeChild(temp)
  } else if (temp instanceof Node) {
    temp.parentNode && temp.parentNode.removeChild(temp)
  }
}
