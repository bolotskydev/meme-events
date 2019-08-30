import { createEvent, delay, delayWithControls } from './utils'

jest.useFakeTimers()

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
})
