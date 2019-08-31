import { createEvent, delay, delayWithControls, initiate$ } from './utils'

jest.useFakeTimers()

// mock console
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

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
    describe('--initiation phase tests', () => {
      beforeAll(() => {
        document.body.innerHTML = `
          <h1 class="title" id="solo">Single</h1>
          <ul class="itemHolder">
            <li class="item">Multiple 1</li> 
            <li class="item">Multiple 2</li> 
            <li class="item">Multiple 3</li> 
          </ul>`
      })
      test('must send warn message to console if window.$ already exists and skip next evaluation steps', () => {
        window.$ = () => 'stub'
        initiate$()
        expect(global.console.warn).toBeCalled()
        expect(global.console.warn).toHaveBeenCalledTimes(1)
        expect(window.$()).toEqual('stub')
        // reset window.$ in order to run the rest of the suit properly
        window.$ = undefined
      })
      test('window object contains $ method after fn initialization', () => {
        initiate$()
        expect(window.$).toBeDefined()
      })
      test('window object contains on method after fn initialization', () => {
        expect(window.on).toBeDefined()
      })
      test('window object contains off method after initialization', () => {
        expect(window.off).toBeDefined()
      })
      test('Node.prototype.on exists after initialization', () => {
        expect(Node.prototype.on).toBeDefined()
      })
      test('Node.prototype.off exists after initialization', () => {
        expect(Node.prototype.off).toBeDefined()
      })
      test('NodeList.prototype.on exists after initialization', () => {
        expect(NodeList.prototype.on).toBeDefined()
      })
      test('NodeList.prototype.off exists after initialization', () => {
        expect(NodeList.prototype.off).toBeDefined()
      })
    })
    describe('--core functionality tests', () => {
      // set up simple html page via jsdom lib
      // for correct handling $ test cases
      beforeAll(() => {
        initiate$()
      })
      test('must throw a TypeError if no selector was passed', () => {
        expect(() => $()).toThrow()
      })
      test('must throw a TypeError if empty selector was passed', () => {
        expect(() => $('')).toThrow()
      })
      /*
       *test('', () => {
       *  expect().toThrow()
       *})
       */
    })
  })
})
