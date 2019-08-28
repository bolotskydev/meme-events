// tools
const { expect } = require('chai')

// what is being tested
const { creditsSet, toBeContinuedSet } = require('../src/index')

describe('Check if all event sets are exposed', () => {
  // check creditsSet
  it('Credits set is not undefined', () => {
    expect(creditsSet).to.not.equal(undefined)
  })
  it('Credits set is not an empty object', () => {
    expect(creditsSet).to.not.be.empty
  })
  // check toBeContinuedSet
  it('toBeContinued set is not undefined', () => {
    expect(toBeContinuedSet).to.not.equal(undefined)
  })
  it('toBeContinued set is not an empty object', () => {
    expect(toBeContinuedSet).to.not.be.empty
  })
})
