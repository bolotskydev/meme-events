/*
 *Simple utils library for memify
 */

// utils container

const utils = {}

// custom event factory
// (memeName: String, eventType: String, options: Object) -> Event Instance
utils.createEvent = (
  memeName = 'MemeEvent',
  eventType = 'Default',
  options = { bubbles: true }
) => new CustomEvent(`${memeName}On${eventType}`, options)

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

// function that introduces jQuery dom manipulation syntax (selecting,adding & removing listeners) globally
// () -> void
utils.initiate$ = () => {
  // check if window has $ property to avoid interfering with other modules
  if (window && window.$) {
    console.warn(
      "$ util function hasn't been initiated: window object already includes $ property"
    )
    return
  }
  /*
   * prepare set of functions
   */
  // es5 style due to this
  const on = function(name, fn, options) {
    this.addEventListener(name, fn, options)
    return this
  }
  const off = function(name, fn, options) {
    this.removeEventListener(name, fn, options)
    return this
  }
  const onForList = function(name, fn, options) {
    this.forEach(el => el.on(name, fn, options))
    return this
  }
  const offForList = function(name, fn, options) {
    this.forEach(el => el.on(name, fn, options))
    return this
  }
  const $ = document.querySelectorAll.bind(document)
  /*
   *expose fns to the window obj
   */
  Object.defineProperties(window, {
    $: {
      value: $,
    },
    on: {
      value: on,
    },
    off: {
      value: off,
    },
  })
  /*
   *handle prototypes
   */
  // add methods to Node prototype
  Object.defineProperties(Node.prototype, {
    on: {
      value: on,
    },
    off: {
      value: off,
    },
  })
  // add methods to the prototype
  Object.defineProperties(NodeList.prototype, {
    on: {
      value: onForList,
    },
    off: {
      value: offForList,
    },
  })
}

export default utils
