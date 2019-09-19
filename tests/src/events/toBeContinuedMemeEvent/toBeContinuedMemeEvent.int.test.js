/* eslint-env node, jest */

// import all functions that require integration testing
import {
  toBeContinuedCleanUp,
  toBeContinuedFinish,
  toBeContinuedTerminate,
  toBeContinuedMemeEvent,
} from '../../../../src/events/toBeContinuedMemeEvent/toBeContinuedMemeEvent'

// jest native timer mocking
jest.useFakeTimers()

// jest Callback mocking
const mockCallback = jest.fn()

// local helpers
const resetBody = () => {
  document.body.innerHTML = `
    <h1>tBC Integration testing </h1> 
    <div id="toBeContinued__arrow" class="toBeContinued__arrow"></div>
    <ul>
      <li>one</li> 
      <li>two</li> 
      <li>three</li> 
      <li>four</li> 
    </ul>
  `
  document.body.classList.add(
    'toBeContinued--colorScheme',
    'toBeContinued--activated'
  )
}
const testEvent = new CustomEvent('TestEvent', { bubbles: true })
const ringtoneStub = document.createElement('audio')

describe('toBeContinuedMemeEvent INTEGRATION TEST SUIT', () => {
  describe('--toBeContinuedCleanUp fn testing', () => {
    beforeEach(() => {
      resetBody()
    })
    test('removes *--activated class from the body', () => {
      toBeContinuedCleanUp()
      jest.runAllTimers()
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeFalsy()
    })
    test('runs removeToBeContinuedUI', () => {
      expect(
        document.body.classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
      expect(document.querySelector('#toBeContinued__arrow')).not.toBeNull()
      toBeContinuedCleanUp()
      jest.runAllTimers()
      expect(
        document.body.classList.contains('toBeContinued--colorScheme')
      ).toBeFalsy()
      expect(document.querySelector('#toBeContinued__arrow')).toBeNull()
    })
    test('does nothing if body has no *--activated class', () => {
      expect(document.querySelector('#toBeContinued__arrow')).not.toBeNull()
      expect(
        document.body.classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
      document.body.classList.remove('toBeContinued--activated')
      toBeContinuedCleanUp()
      jest.runAllTimers()
      expect(document.querySelector('#toBeContinued__arrow')).not.toBeNull()
      expect(
        document.body.classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
    })
  })
  describe('--toBeContinuedFinish fn testing', () => {
    beforeEach(() => {
      resetBody()
    })
    test('works if no params passed', () => {
      expect(() => toBeContinuedFinish()()).not.toThrow()
    })
    test('does nothing if body has no *--activated class', () => {
      expect(
        document.body.classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeTruthy()
      document.body.classList.remove('toBeContinued--activated')
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeFalsy()
      toBeContinuedFinish()()
      expect(document.querySelector('#toBeContinued__arrow')).not.toBeNull()
      expect(
        document.body.classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
    })
    test('runs toBeContinuedCleanUp', () => {
      expect(document.querySelector('#toBeContinued__arrow')).not.toBeNull()
      expect(
        document.body.classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeTruthy()
      toBeContinuedFinish()()
      jest.runAllTimers()
      expect(document.querySelector('#toBeContinued__arrow')).toBeNull()
      expect(
        document.body.classList.contains('toBeContinued--colorScheme')
      ).toBeFalsy()
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeFalsy()
    })
    test('dispatches default CustomEvent if no params passed', () => {
      document.body.addEventListener('DefaultMemeEventOnFinish', mockCallback)
      toBeContinuedFinish()()
      expect(mockCallback).toBeCalled()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      document.body.removeEventListener(
        'DefaultMemeEventOnFinish',
        mockCallback
      )
    })
    test('dispatches passed CustomEvent', () => {
      document.body.addEventListener('TestEvent', mockCallback)
      toBeContinuedFinish(testEvent)()
      expect(mockCallback).toBeCalled()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      document.body.removeEventListener('TestEvent', mockCallback)
    })
    test('does run fnOnFinish once if specified', () => {
      toBeContinuedFinish(undefined, mockCallback)()
      expect(mockCallback).toBeCalled()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })
  describe('--toBeContinuedTerminate fn testing', () => {
    beforeAll(() => {
      HTMLMediaElement.prototype.play = mockCallback
      HTMLMediaElement.prototype.pause = mockCallback
    })
    beforeEach(() => {
      resetBody()
    })
    test('runs .pause method on passed Audio object', () => {
      toBeContinuedTerminate(ringtoneStub, testEvent, [], undefined)()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
    test('runs terminationFns if passed array length == 1', () => {
      toBeContinuedTerminate(
        ringtoneStub,
        testEvent,
        [mockCallback],
        undefined
      )()
      expect(mockCallback).toHaveBeenCalledTimes(2)
    })
    test('runs terminationFns if passed array length > 1', () => {
      toBeContinuedTerminate(
        ringtoneStub,
        testEvent,
        [mockCallback, mockCallback, mockCallback],
        undefined
      )()
      expect(mockCallback).toBeCalled()
      expect(mockCallback).toHaveBeenCalledTimes(4)
    })
    test('runs toBeContinuedOnFinish with only event arg', () => {
      toBeContinuedTerminate(
        ringtoneStub,
        testEvent,
        [mockCallback, mockCallback],
        undefined
      )()
      expect(mockCallback).toHaveBeenCalledTimes(3)
    })
    test('runs toBeContinuedOnFinish with both arguments', () => {
      toBeContinuedTerminate(ringtoneStub, testEvent, [], mockCallback)()
      expect(mockCallback).toHaveBeenCalledTimes(2)
    })
  })
  describe('--toBeContinuedMemeEvent fn testing', () => {
    beforeAll(() => {
      HTMLMediaElement.prototype.play = jest.fn(function sendEvent() {
        this.dispatchEvent(new Event('loadedmetadata', { bubbles: true }))
      })
    })
    beforeEach(() => {
      document.body.innerHTML = `
    <h1>tBC Integration testing </h1> 
  `
      document.body.classList = []
    })
    test('does not run if body has --activated class', () => {
      document.body.classList.add('toBeContinued--activated')
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeTruthy()
      toBeContinuedMemeEvent()()
      jest.runAllTimers()
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeTruthy()
      expect(HTMLMediaElement.prototype.play).not.toBeCalled()
    })
    test('does run if body has no --activated class', () => {
      document.body.addEventListener('toBeContinuedOnStart', mockCallback)
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeFalsy()
      toBeContinuedMemeEvent()()
      expect(
        document.body.classList.contains('toBeContinued--activated')
      ).toBeTruthy()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      document.body.removeEventListener('toBeContinuedOnStart', mockCallback)
    })
    test('does run the fnOnStart if passed', () => {
      toBeContinuedMemeEvent({ fnOnStart: mockCallback })()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
    // @TODO
    // unable to test many other cases: unreachable code structure for now
  })
})
