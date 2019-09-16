/* eslint-env node, jest */

import {
  removeToBeContinuedUI,
  addToBeContinuedArrow,
} from './toBeContinuedMemeEvent'

// jest native timer mocking
jest.useFakeTimers()


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
        document.body.removeChild(document.querySelector('#toBeContinued__arrow'))
        removeToBeContinuedUI()
        jest.runAllTimers()
        expect(
          document.body.classList.contains('toBeContinued--colorScheme')
        ).toBeTruthy()
      })
      test('correctly adds *--out class to the arrow element', () => {
        removeToBeContinuedUI()
        expect(
          document.querySelector('#toBeContinued__arrow').classList.contains(
            'toBeContinued__arrow--out'
          )
        ).toBeTruthy()
        jest.runAllTimers()
      })
      test('correctly removes arrow element with delay fn', () => {
        removeToBeContinuedUI()
        expect(document.querySelector('#toBeContinued__arrow')).not.toBeNull()
        jest.runAllTimers()
        expect(document.querySelector('#toBeContinued__arrow')).toBeNull()
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500)
      })
      test('correctly removes event decoration class from the body element with delay fn', () => {
        removeToBeContinuedUI()
        expect(
          document.body.classList.contains('toBeContinued--colorScheme')
        ).toBeTruthy()
        jest.runAllTimers()
        expect(
          document.body.classList.contains('toBeContinued--colorScheme')
        ).toBeFalsy()
      })
      test('does not crashes if body has no decoration class', () => {
        document.body.classList.remove('toBeContinued--colorScheme')
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
        expect(document.querySelector('#toBeContinued__arrow').parentNode).toBe(document.body)
      })
      test('appended arrow element has class and id of toBeContinued__arrow ', () => {
        addToBeContinuedArrow()
        expect(
          document.querySelector('#toBeContinued__arrow').classList.contains(
            'toBeContinued__arrow'
          )
        ).toBeTruthy()
        expect(document.querySelector('.toBeContinued__arrow').id).toBe('toBeContinued__arrow')
      })
      test('appended arrow el has svg inside', () => {
        addToBeContinuedArrow()
        expect(document.querySelector('svg').parentNode).toBe(document.querySelector('#toBeContinued__arrow'))
      })
    })
  })
})
