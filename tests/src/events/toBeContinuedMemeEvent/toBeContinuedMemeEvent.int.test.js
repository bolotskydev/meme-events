/* eslint-env node, jest */
/* global $ */

// import all functions that require integration testing
import {
  toBeContinuedCleanUp,
  toBeContinuedFinish,
  toBeContinuedTerminate,
  toBeContinuedMemeEvent,
} from '../../../../src/events/toBeContinuedMemeEvent/toBeContinuedMemeEvent'

// import events helper function
import { initiate$ } from '../../../../src/helpers/utils'

// activate
initiate$()

// jest native timer mocking
jest.useFakeTimers()

// jest Callback mocking
const mockCallbackWithLog = jest.fn(() =>
  console.log('mockCallback has been invoked')
)
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

describe('toBeContinuedMemeEvent INTEGRATION TEST SUIT', () => {
  describe('--toBeContinuedCleanUp fn testing', () => {
    beforeEach(() => {
      resetBody()
    })
    test('removes *--activated class from the body', () => {
      toBeContinuedCleanUp()
      jest.runAllTimers()
      expect(
        $('body')[0].classList.contains('toBeContinued--activated')
      ).toBeFalsy()
    })
    test('runs removeToBeContinuedUI', () => {
      expect(
        $('body')[0].classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
      expect($('#toBeContinued__arrow').length).toBe(1)
      toBeContinuedCleanUp()
      jest.runAllTimers()
      expect(
        $('body')[0].classList.contains('toBeContinued--colorScheme')
      ).toBeFalsy()
      expect($('#toBeContinued__arrow').length).toBe(0)
    })
    test('does nothing if body has no *--activated class', () => {
      expect($('#toBeContinued__arrow')[0]).toBeDefined()
      expect(
        $('body')[0].classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
      $('body')[0].classList.remove('toBeContinued--activated')
      toBeContinuedCleanUp()
      jest.runAllTimers()
      expect($('#toBeContinued__arrow')[0]).toBeDefined()
      expect(
        $('body')[0].classList.contains('toBeContinued--colorScheme')
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
        $('body')[0].classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
      expect(
        $('body')[0].classList.contains('toBeContinued--activated')
      ).toBeTruthy()
      $('body')[0].classList.remove('toBeContinued--activated')
      expect(
        $('body')[0].classList.contains('toBeContinued--activated')
      ).toBeFalsy()
      toBeContinuedFinish()()
      expect($('#toBeContinued__arrow').length).toBe(1)
      expect(
        $('body')[0].classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
    })
    test('runs toBeContinuedCleanUp', () => {
      expect($('#toBeContinued__arrow').length).toBe(1)
      expect(
        $('body')[0].classList.contains('toBeContinued--colorScheme')
      ).toBeTruthy()
      expect(
        $('body')[0].classList.contains('toBeContinued--activated')
      ).toBeTruthy()
      toBeContinuedFinish()()
      jest.runAllTimers()
      expect($('#toBeContinued__arrow').length).toBe(0)
      expect(
        $('body')[0].classList.contains('toBeContinued--colorScheme')
      ).toBeFalsy()
      expect(
        $('body')[0].classList.contains('toBeContinued--activated')
      ).toBeFalsy()
    })
    test('dispatches default CustomEvent if no params passed', () => {
      $('body')[0].on('DefaultMemeEventOnFinish', mockCallback)
      toBeContinuedFinish()()
      expect(mockCallback).toBeCalled()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
    test('dispatches passed CustomEvent', () => {
      $('body')[0].on('TestEvent', mockCallback)
      toBeContinuedFinish(testEvent)()
      expect(mockCallback).toBeCalled()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
    test('does run fnOnFinish once if specified', () => {
      toBeContinuedFinish(undefined, mockCallbackWithLog)()
      expect(mockCallbackWithLog).toBeCalled()
      expect(mockCallbackWithLog).toHaveBeenCalledTimes(1)
    })
  })
  describe('--toBeContinuedTerminate fn testing', () => {
    test.todo('write tests for tbc terminate ')
  })
  describe('--toBeContinuedMemeEvent fn testing', () => {
    test.todo('write tests for tbc main fn')
  })
})
