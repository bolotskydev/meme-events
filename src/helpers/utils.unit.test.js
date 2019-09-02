/* eslint-env node, jest */
import { createEvent, delay, delayWithControls, initiate$ } from './utils'

/*
 *HELPERS & MOCKS
 */
/* global $ */
jest.useFakeTimers()

// mock console
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
// simple click simulation function
// simulateClick(el: Node) -> Node
const simulateClick = el => {
  const click = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  })
  el.dispatchEvent(click)
  return el
}

// clean up changes after initiate$
const cleanUpAfterInitiate$ = () => {
  window.$ = undefined
  window.on = undefined
  window.off = undefined
  Node.prototype.on = undefined
  Node.prototype.off = undefined
  NodeList.prototype.on = undefined
  NodeList.prototype.off = undefined
}

/*
 *TEST SECTION
 */

describe('UTILS UNIT TEST SUIT', () => {
  // setup
  // native function to be passed for testing purpose
  const callback = jest.fn()
  // amount of time passed function should be invoked after
  const time = 1000
  // test delay fn
  describe('delay function testing', () => {
    test('delay invokes passed fn once right after passed amount of time', () => {
      delay(callback)(time)
      // ensure that passed fn only invoked after passing of time param
      expect(callback).not.toBeCalled()
      // fast forward timers
      jest.runAllTimers()
      expect(callback).toBeCalled()
      expect(callback).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), time)
    })
    test('delay does nothing if passed two parameters (currying misuse)', () => {
      delay(callback, time)
      jest.runAllTimers()
      expect(callback).not.toBeCalled()
    })
    test('delay does nothing if invoked with only 1 parameter', () => {
      delay(callback)
      jest.runAllTimers()
      expect(callback).not.toBeCalled()
    })
  })
  // test delayWithControls fn
  describe('delayWithControls function testing', () => {
    test('returns back function', () => {
      expect(typeof delayWithControls(callback)(time)).toBe('function')
      jest.runAllTimers()
    })
    test('invokes passed fn once right after passed amount of time', () => {
      delayWithControls(callback)(time)
      // ensure that passed fn only invoked after passing of time param
      expect(callback).not.toBeCalled()
      // fast forward timers
      jest.runAllTimers()
      expect(callback).toBeCalled()
      expect(callback).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), time)
    })
    test('returned function correctly clears interval evaluation if invoked', () => {
      const clear = delayWithControls(callback)(time)
      expect(callback).not.toBeCalled()
      clear()
      jest.runAllTimers()
      expect(callback).not.toBeCalled()
      expect(clearTimeout).toBeCalled()
    })
    test('does nothing if passed two parameters (currying misuse)', () => {
      delayWithControls(callback, time)
      jest.runAllTimers()
      expect(callback).not.toBeCalled()
    })
    test('does nothing if invoked with only 1 parameter', () => {
      delayWithControls(callback)
      jest.runAllTimers()
      expect(callback).not.toBeCalled()
    })
  })
  describe('createEvent function testing', () => {
    test('creates default event instance if no params passed', () => {
      const event = createEvent()
      expect(event).toBeDefined()
      expect(event.type).toBe('MemeEventOnDefault')
      expect(event.bubbles).toBe(true)
    })
    test('correctly creates event instances if the right amount of params passed', () => {
      const event = createEvent('Test', 'Start', {
        bubbles: true,
        detail: { test: 'data' },
      })
      expect(event).toBeDefined()
      expect(event.type).toBe('TestOnStart')
      expect(event.bubbles).toBe(true)
      expect(event.detail).toEqual({ test: 'data' })
    })
  })
  describe('initiate$ function testing', () => {
    beforeAll(() => {
      // set up simple html page via jsdom lib
      // for correct handling $ test cases
      document.body.innerHTML = `
          <h1 class="title" id="solo">Single</h1>
          <ul class="itemHolder">
            <li class="item">Multiple 1</li> 
            <li class="item">Multiple 2</li> 
            <li class="item">Multiple 3</li> 
          </ul>`
    })
    beforeEach(() => {
      initiate$()
    })
    afterEach(() => {
      cleanUpAfterInitiate$()
    })
    describe('--initiation phase tests', () => {
      test('must send warn message to console if window.$ already exists and skip next evaluation steps', () => {
        cleanUpAfterInitiate$()
        window.$ = () => 'stub'
        initiate$()
        expect(global.console.warn).toBeCalled()
        expect(global.console.warn).toHaveBeenCalledTimes(1)
        expect(window.$()).toEqual('stub')
        expect(window.on).not.toBeDefined()
        expect(window.off).not.toBeDefined()
        expect(Node.prototype.on).not.toBeDefined()
        expect(Node.prototype.off).not.toBeDefined()
        expect(NodeList.prototype.on).not.toBeDefined()
        expect(NodeList.prototype.off).not.toBeDefined()
      })
      test('window object contains $, on and off methods after fn initialization', () => {
        expect(window.$).toBeDefined()
        expect(window.on).toBeDefined()
        expect(window.off).toBeDefined()
      })
      test('Node.prototype.(on|off) exists after initialization', () => {
        expect(Node.prototype.on).toBeDefined()
        expect(Node.prototype.off).toBeDefined()
      })
      test('NodeList.prototype.(on|off) exists after initialization', () => {
        expect(NodeList.prototype.on).toBeDefined()
        expect(NodeList.prototype.off).toBeDefined()
      })
    })
    describe('--core functionality tests', () => {
      beforeAll(() => {
        initiate$()
      })
      afterAll(() => {
        cleanUpAfterInitiate$()
      })
      test('must throw an Error if no selector was passed', () => {
        expect(() => $()).toThrow()
      })
      test('must throw an Error if empty selector was passed', () => {
        expect(() => $('')).toThrow()
      })
      test('must return empty NodeList if no matches found', () => {
        const empty = $('empty')
        expect(empty.length).toBe(0)
        expect(empty instanceof NodeList).toBeTruthy()
      })
      test('must return NodeList with length == 1 if passed selector matches single element', () => {
        expect($('body').length).toBe(1)
      })
      test('single Node in returned collection has .on method working correctly', () => {
        $('body')[0].on('click', callback)
        simulateClick($('body')[0])
        expect(callback).toBeCalled()
        expect(callback).toHaveBeenCalledTimes(1)
      })
      test('single Node in returned collection has .off method working correctly', () => {
        $('body')[0].on('click', callback)
        $('body')[0].off('click', callback)
        simulateClick($('body')[0])
        expect(callback).not.toBeCalled()
      })
      test('must return NodeList with length > 1 if passed selector matches multiple elements', () => {
        expect($('li').length).toBeGreaterThan(1)
      })
      test('returned NodeList has .on method working correctly', () => {
        $('li').on('click', callback)
        simulateClick($('li')[0])
        expect(callback).toBeCalled()
        $('li').forEach(node => simulateClick(node))
        expect(callback).toHaveBeenCalledTimes(4)
      })
      test('returned NodeList has .off method working correctly', () => {
        $('li').on('click', callback)
        $('li').off('click', callback)
        simulateClick($('li')[0])
        expect(callback).not.toBeCalled()
        $('li').forEach(node => simulateClick(node))
        expect(callback).not.toBeCalled()
      })
    })
    describe('--optional functionality test', () => {
      test('able to use .on method on window correctly', () => {
        window.on('click', callback)
        simulateClick(window)
        expect(callback).toBeCalled()
        expect(callback).toHaveBeenCalledTimes(1)
      })
      test('able to use .off method on window correctly', () => {
        window.on('click', callback)
        window.off('click', callback)
        simulateClick(window)
        expect(callback).not.toBeCalled()
      })
      test('able to use .on method directly on the result of qS', () => {
        const bd = document.querySelector('body')
        bd.on('click', callback)
        simulateClick(bd)
        expect(callback).toBeCalled()
        expect(callback).toHaveBeenCalledTimes(1)
      })
      test('able to use .off method directly on the result of qS', () => {
        const bd = document.querySelector('body')
        bd.on('click', callback)
        bd.off('click', callback)
        simulateClick(bd)
        expect(callback).not.toBeCalled()
      })
      test('able to use .on method directly on the results of qSA', () => {
        const all = document.querySelectorAll('li')
        all.on('click', callback)
        simulateClick(all[0])
        expect(callback).toBeCalled()
        all.forEach(node => simulateClick(node))
        expect(callback).toHaveBeenCalledTimes(4)
      })
      test('able to use .off method directly on the results of qSA', () => {
        const all = document.querySelectorAll('li')
        all.on('click', callback)
        all.off('click', callback)
        simulateClick(all[0])
        expect(callback).not.toBeCalled()
        all.forEach(node => simulateClick(node))
        expect(callback).not.toBeCalled()
      })
    })
  })
})
