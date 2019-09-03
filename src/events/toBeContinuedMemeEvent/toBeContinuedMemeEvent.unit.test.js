import {
  removeToBeContinuedUI,
  addToBeContinuedArrow,
  toBeContinuedCleanUp,
} from './toBeContinuedMemeEvent'

/* eslint-env node, jest */
jest.resetModules()
jest.clearAllMocks()
jest.useFakeTimers()

/* global $ */

describe('toBeContinuedMemeEvent UNIT TEST SUIT', () => {
  describe('--helpers function tests', () => {
    describe('removeToBeContinuedUI fn testing', () => {
      beforeEach(() => {
        document.body.innerHTML = `
          <h1>removeToBeContinuedUI fn test</h1>
          <div id="toBeContinued__arrow"></div>
        `
        document.body.classList.add('toBeContinued--colorScheme')
      })
      test('does nothing if no arrow element found', () => {
        $('body')[0].removeChild($('#toBeContinued__arrow')[0])
        removeToBeContinuedUI()
        jest.runAllTimers()
        expect(
          $('body')[0].classList.contains('toBeContinued--colorScheme')
        ).toBeTruthy()
      })
      test('correctly adds *--out class to the arrow element', () => {
        removeToBeContinuedUI()
        expect(
          $('#toBeContinued__arrow')[0].classList.contains(
            'toBeContinued__arrow--out'
          )
        ).toBeTruthy()
        jest.runAllTimers()
      })
      test('correctly removes arrow element with delay fn', () => {
        removeToBeContinuedUI()
        expect($('#toBeContinued__arrow')[0]).toBeDefined()
        jest.runAllTimers()
        expect($('#toBeContinued__arrow')[0]).not.toBeDefined()
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500)
      })
      test('correctly removes event decoration class from the body element with delay fn', () => {
        removeToBeContinuedUI()
        expect(
          $('body')[0].classList.contains('toBeContinued--colorScheme')
        ).toBeTruthy()
        jest.runAllTimers()
        expect(
          $('body')[0].classList.contains('toBeContinued--colorScheme')
        ).toBeFalsy()
      })
      test('does not crashes if body has no decoration class', () => {
        $('body')[0].classList.remove('toBeContinued--colorScheme')
        jest.runAllTimers()
        expect(() => removeToBeContinuedUI()).not.toThrow()
      })
    })
    describe('addToBeContinuedArrow fn testing', () => {
      beforeEach(() => {
        document.body.innerHTML = `
          <h1>removeToBeContinuedUI fn test</h1>
        `
      })
      test('correctly appends arrow element to the body', () => {
        addToBeContinuedArrow()
        expect($('#toBeContinued__arrow')[0].parentNode).toBe($('body')[0])
      })
      test('appended arrow element has class and id of toBeContinued__arrow ', () => {
        addToBeContinuedArrow()
        expect(
          $('#toBeContinued__arrow')[0].classList.contains(
            'toBeContinued__arrow'
          )
        ).toBeTruthy()
        expect($('.toBeContinued__arrow')[0].id).toBe('toBeContinued__arrow')
      })
      test('appended arrow el has svg inside', () => {
        addToBeContinuedArrow()
        expect($('svg')[0].parentNode).toBe($('#toBeContinued__arrow')[0])
      })
    })
  })
})
