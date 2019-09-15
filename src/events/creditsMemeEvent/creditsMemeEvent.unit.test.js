import { addCreditsBackdrop, runCreditsTitles } from './creditsMemeEvent'

/* eslint-env node, jest */

jest.useFakeTimers()

describe('test suit for creditsMemeEvent', () => {
  describe('addCreditsBackdrop function testing', () => {
    beforeAll(() => {
      document.body.innerHTML = `
        <h1>backdrop testing</h1>
      `
    })
    test('appends backdrop element to a body', () => {
      const snapshot = document.body.innerHTML
      addCreditsBackdrop()
      expect(document.body.innerHTML).not.toEqual(snapshot)
      expect(document.querySelector('div')).toBeDefined()
    })
    test('appended element has correct class', () => {
      // leverage previous addCreditsBackdrop fn call
      expect(
        document.querySelector('div').classList.contains('credits__backdrop')
      ).toBeTruthy()
    })
  })
  describe('runCreditsTitles function testing', () => {
    // leveraging previous fn call again
    test('structure changes after 1s delay, changes are valid', () => {
      const snapshot = document.body.innerHTML
      runCreditsTitles()
      jest.runAllTimers()
      expect(document.body.innerHTML).not.toEqual(snapshot)
      expect(document.querySelector('p').innerHTML).toEqual('jeff garlin')
      expect(setTimeout).toBeCalled()
      expect(setTimeout).toHaveBeenCalledTimes(2)
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000)
    })
  })
})
