/* eslint-env node, jest */

// import all functions that require integration testing
import {
  removeCreditsUI,
  creditsCleanUp,
  addCreditsUI,
  creditsFinish,
  creditsTerminate,
  creditsMemeEvent,
} from '../../../../src/events/creditsMemeEvent/creditsMemeEvent'

// jest helper
jest.useFakeTimers()
const mockCallback = jest.fn().mockName('commonCallback')

// common helpers
const resetBody = () => {
  document.body.innerHTML = `
    <h1> creditsMeme testing </h1 >
    <div> creditsMeme testing </div> 
  `
  document.body.classList = []
}
const testEvent = new CustomEvent('TestEvent', { bubbles: true })
const mockMedia = document.createElement('audio')

describe('creditsMemeEvent INTEGRATION TEST SUIT', () => {
  describe('removeCreditsUI fn testing', () => {
    beforeEach(() => {
      resetBody()
    })
    test('correctly calls removeNode inside and removes backdrop', () => {
      document.querySelector('div').classList.add('credits__backdrop')
      removeCreditsUI()
      expect(document.querySelector('.credits__backdrop')).toBeNull()
    })
  })
  describe('creditsCleanUp fn testing', () => {
    beforeEach(() => {
      resetBody()
      document.body.classList.add('credits--activated')
      document.querySelector('div').classList.add('credits__backdrop')
    })
    test('removes --activated class from the body', () => {
      expect(
        document.body.classList.contains('credits--activated')
      ).toBeTruthy()
      creditsCleanUp()
      expect(document.body.classList.contains('credits--activated')).toBeFalsy()
    })
    test('calls removeCreditsUI', () => {
      expect(document.querySelector('div')).not.toBeNull()
      creditsCleanUp()
      expect(document.querySelector('div')).toBeNull()
    })
  })
  describe('addCreditsUI fn testing', () => {
    beforeEach(() => {
      resetBody()
    })
    test('calls addCreditsBackdrop so body will contain backdrop el', () => {
      expect(document.querySelector('.credits__backdrop')).toBeNull()
      addCreditsUI()
      expect(document.querySelector('.credits__backdrop')).not.toBeNull()
    })
    test('calls runCreditTitles so backdrop will be changed', () => {
      addCreditsUI()
      expect(document.querySelector('.credits__backdrop p').innerHTML).toBe(
        'robert b. weide'
      )
      jest.runAllTimers()
      expect(document.querySelector('.credits__backdrop p').innerHTML).toBe(
        'jeff garlin'
      )
    })
  })
  describe('creditsFinish fn testing', () => {
    beforeEach(() => resetBody())
    test('does not run if body has no --activated class', () => {
      document.querySelector('div').classList.add('credits__backdrop')
      expect(document.querySelector('.credits__backdrop')).not.toBeNull()
      creditsFinish(testEvent)()
      expect(document.querySelector('.credits__backdrop')).not.toBeNull()
    })
    test('uses default event if no event obj passed & does not throw', () => {
      document.body.classList.add('credits--activated')
      document.body.addEventListener('DefaultCreditsMemeEvent', mockCallback)
      expect(() => creditsFinish()()).not.toThrow()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      document.body.removeEventListener('DefaultCreditsMemeEvent', mockCallback)
    })
    test('dispatches passed event & runs creditsCleanUp', () => {
      document.body.addEventListener('TestEvent', mockCallback)
      document.querySelector('div').classList.add('credits__backdrop')
      document.body.classList.add('credits--activated')
      creditsFinish(testEvent)()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(document.body.classList.contains('credits--activated')).toBeFalsy()
      expect(document.querySelector('credits__backdrop')).toBeNull()
      document.body.removeEventListener('TestEvent', mockCallback)
    })
    test('runs optional fn if passed', () => {
      document.body.classList.add('credits--activated')
      creditsFinish(testEvent, mockCallback)()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })
  describe('creditsTerminate fn testing', () => {
    beforeEach(() => {
      resetBody()
      HTMLMediaElement.prototype.pause = mockCallback
    })
    test('uses .pause method on passed audio object', () => {
      creditsTerminate(mockMedia, testEvent, [])()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
    test('does not throw if no terminationFns passed', () => {
      expect(() => creditsTerminate(mockMedia, testEvent)()).not.toThrow()
    })
    test('runs set on terminationFns with length == 1', () => {
      creditsTerminate(mockMedia, testEvent, [mockCallback])()
      expect(mockCallback).toHaveBeenCalledTimes(2)
    })
    test('runs set on terminationFns with length > 1', () => {
      creditsTerminate(mockMedia, testEvent, [mockCallback, mockCallback])()
      expect(mockCallback).toHaveBeenCalledTimes(3)
    })
    test('runs creditsFinish', () => {
      document.body.addEventListener('TestEvent', mockCallback)
      document.querySelector('div').classList.add('credits__backdrop')
      document.body.classList.add('credits--activated')
      creditsTerminate(mockMedia, testEvent, [])()
      expect(mockCallback).toHaveBeenCalledTimes(2)
      expect(document.body.classList.contains('credits--activated')).toBeFalsy()
      expect(document.querySelector('credits__backdrop')).toBeNull()
      document.body.removeEventListener('TestEvent', mockCallback)
    })
  })
  describe('creditsMemeEvent fn testing', () => {
    beforeEach(() => {
      resetBody()
      HTMLMediaElement.prototype.play = jest.fn(function() {
        this.dispatchEvent(new Event('loadedmetadata', { bubbles: true }))
      })
    })
    test('does not run if body has --activated class', () => {
      document.body.classList.add('credits--activated')
      expect(
        document.body.classList.contains('credits--activated')
      ).toBeTruthy()
      expect(() => creditsMemeEvent()()).not.toThrow()
      jest.runAllTimers()
      expect(
        document.body.classList.contains('credits--activated')
      ).toBeTruthy()
      expect(HTMLMediaElement.prototype.play).not.toBeCalled()
    })
    test('does run if body has no --activated class', () => {
      document.body.addEventListener('creditsOnStart', mockCallback)
      expect(document.body.classList.contains('credits--activated')).toBeFalsy()
      creditsMemeEvent()()
      expect(
        document.body.classList.contains('credits--activated')
      ).toBeTruthy()
      jest.runAllTimers()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      document.body.removeEventListener('creditsOnStart', mockCallback)
    })
    test('does run the fnOnStart if passed', () => {
      creditsMemeEvent({ fnOnStart: mockCallback })()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
    // @TODO
    // unable to test many other cases: unreachable code structure for now
  })
})
