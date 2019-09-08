/* eslint-env node, jest */
/* global $ */

// import all functions that require integration testing
import {
  removeCreditsUI,
  creditsCleanUp,
  addCreditsUI,
  creditsFinish,
  creditsTerminate,
  creditsMemeEvent,
} from '../../../../src/events/creditsMemeEvent/creditsMemeEvent'
// import dep
import { initiate$ } from '../../../../src/helpers/utils'

initiate$()

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
      $('div')[0].classList.add('credits__backdrop')
      removeCreditsUI()
      expect($('.credits__backdrop').length).toBe(0)
    })
  })
  describe('creditsCleanUp fn testing', () => {
    beforeEach(() => {
      resetBody()
      $('body')[0].classList.add('credits--activated')
      $('div')[0].classList.add('credits__backdrop')
    })
    test('removes --activated class from the body', () => {
      expect($('body')[0].classList.contains('credits--activated')).toBeTruthy()
      creditsCleanUp()
      expect($('body')[0].classList.contains('credits--activated')).toBeFalsy()
    })
    test('calls removeCreditsUI', () => {
      expect($('div').length).toBe(1)
      creditsCleanUp()
      expect($('div').length).toBe(0)
    })
  })
  describe('addCreditsUI fn testing', () => {
    beforeEach(() => {
      resetBody()
    })
    test('calls addCreditsBackdrop so body will contain backdrop el', () => {
      expect($('.credits__backdrop').length).toBe(0)
      addCreditsUI()
      expect($('.credits__backdrop').length).toBe(1)
    })
    test('calls runCreditTitles so backdrop will be changed', () => {
      addCreditsUI()
      expect($('.credits__backdrop p')[0].innerHTML).toBe('robert b. weide')
      jest.runAllTimers()
      expect($('.credits__backdrop p')[0].innerHTML).toBe('jeff garlin')
    })
  })
  describe('creditsFinish fn testing', () => {
    beforeEach(() => resetBody())
    test('does not run if body has no --activated class', () => {
      $('div')[0].classList.add('credits__backdrop')
      expect($('.credits__backdrop').length).toBe(1)
      creditsFinish(testEvent)()
      expect($('.credits__backdrop').length).toBe(1)
    })
    test('uses default event if no event obj passed & does not throw', () => {
      $('body')[0].classList.add('credits--activated')
      $('body')[0].on('DefaultCreditsMemeEvent', mockCallback)
      expect(() => creditsFinish()()).not.toThrow()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      $('body')[0].off('DefaultCreditsMemeEvent', mockCallback)
    })
    test('dispatches passed event & runs creditsCleanUp', () => {
      $('body')[0].on('TestEvent', mockCallback)
      $('div')[0].classList.add('credits__backdrop')
      $('body')[0].classList.add('credits--activated')
      creditsFinish(testEvent)()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect($('body')[0].classList.contains('credits--activated')).toBeFalsy()
      expect($('credits__backdrop').length).toBe(0)
      $('body')[0].off('TestEvent', mockCallback)
    })
    test('runs optional fn if passed', () => {
      $('body')[0].classList.add('credits--activated')
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
      $('body')[0].on('TestEvent', mockCallback)
      $('div')[0].classList.add('credits__backdrop')
      $('body')[0].classList.add('credits--activated')
      creditsTerminate(mockMedia, testEvent, [])()
      expect(mockCallback).toHaveBeenCalledTimes(2)
      expect($('body')[0].classList.contains('credits--activated')).toBeFalsy()
      expect($('credits__backdrop').length).toBe(0)
      $('body')[0].off('TestEvent', mockCallback)
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
      $('body')[0].classList.add('credits--activated')
      expect($('body')[0].classList.contains('credits--activated')).toBeTruthy()
      expect(() => creditsMemeEvent()()).not.toThrow()
      jest.runAllTimers()
      expect($('body')[0].classList.contains('credits--activated')).toBeTruthy()
      expect(HTMLMediaElement.prototype.play).not.toBeCalled()
    })
    test('does run if body has no --activated class', () => {
      $('body')[0].on('creditsOnStart', mockCallback)
      expect($('body')[0].classList.contains('credits--activated')).toBeFalsy()
      creditsMemeEvent()()
      expect($('body')[0].classList.contains('credits--activated')).toBeTruthy()
      jest.runAllTimers()
      expect(mockCallback).toHaveBeenCalledTimes(1)
      $('body')[0].off('creditsOnStart', mockCallback)
    })
    test('does run the fnOnStart if passed', () => {
      creditsMemeEvent({ fnOnStart: mockCallback })()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
    // @TODO
    // unable to test many other cases: unreachable code structure for now
  })
})
