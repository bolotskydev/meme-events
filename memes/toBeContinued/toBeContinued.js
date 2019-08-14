/*
 *CSS & JS version of toBeContinued meme from JoJo
 *origin: https://www.youtube.com/watch?v=70syHNphIQg
 */

// deps
const utils = require('../../deps/utils')

// assets
const memeTrack = require('./assets/roundabout.mp3')

// function that assumes to be passed to addEventListener, triggers toBeContinued meme
// (optional: {fnOnStart: Function, fnOnFinish: Function}) -> void
const toBeContinued = ({ fnOnStart , fnOnFinish } = {}) => {
  // prevent triggering if already activated
  if (document.body.classList.contains('toBeContinued--activated')) return
  // get custom events
  const {toBeContinuedOnStart, toBeContinuedOnFinish} = utils.createEvents('toBeContinued', toBeContinuedClearUp, fnOnFinish)
  // dispatch custom event toBeContinuedStart
  document.body.dispatchEvent(toBeContinuedOnStart)
  // run optional onStart
  fnOnStart && fnOnStart()
  // run meme
  toBeContinuedRun(toBeContinuedOnFinish, fnOnFinish)
}

// toBeContinued Helper Functions

// run meme
const toBeContinuedRun = ( toBeContinuedOnFinish, fnOnFinish ) => {
  // add initial class to body in order to prevent future meme activation
  document.body.classList.add('toBeContinued--activated')
  // create audio instance
  const ringtone = new Audio(memeTrack)
  // delay clear up and and fnOnFinish until music is over 
  ringtone.onloadedmetadata = e => {
    // delay until first part of ringtone is played
    setTimeout(() => {
      if (document.body.classList.contains('toBeContinued--activated')) {
      // add styling class to body 
      document.body.classList.add('toBeContinued--colorScheme')
      // add arrow
      addArrow()
      }
    }, 4000)
    setTimeout(() => {
      // clear at the end
      toBeContinuedClearUp(() => ringtone.pause()) 
      // dispatch custom event toBeContinuedOnFinish
      document.body.dispatchEvent(toBeContinuedOnFinish) 
      // run optional onFinish fn
      fnOnFinish && fnOnFinish()
    }, e.target.duration * 1000)
  }
  // activate ringtone
  ringtone.play() 
}

// remove meme
// stopPlaying: Function -> void
const toBeContinuedClearUp = stopPlaying => {
  // save arrow el in variable
  const arrow = document.getElementById('toBeContinued__arrow')
  // don't proceed if no arrow exist
  if (!arrow) return
  // animate out arrow element
  arrow.classList.add('toBeContinued__arrow--out')
  // delay some procedures for smooth clearing
  setTimeout(() => {
    // disable meme track
    stopPlaying()
  // remove arrow element right after flew out
    document.body.removeChild(arrow)
  // remove styling class from body
  document.body.classList.remove('toBeContinued--colorScheme')
  document.body.classList.remove('toBeContinued--activated')

  }, 500)
} 

// creates and appends arrow element to document.body
// () -> void
const addArrow = () => {
  // create html structure
  const arrow = document.createElement('div')
  arrow.classList.add('toBeContinued__arrow')
  arrow.id = 'toBeContinued__arrow'
  // set inner html to svg arrow
  arrow.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 350 100">
    <path d="M 0 50, L 50 0, v20,h230, v60, h-230,v20, L 0 50" stroke="white" stroke-width="3"/>
    <path d="M 290 20, v60, h20, L 290 20" stroke="white" stroke-width="3" />
    <path d="M 300 20, h20, v60, L 300 20" stroke="white" stroke-width="3" />
    <path d="M 330 80, v-60, h20, L 330 80" stroke="white" stroke-width="3" />
    <text x="55" y="60" font-size="30" fill="white">To Be Continued</text>
  </svg> 
  `
  // add arrow to a body
  document.body.appendChild(arrow)
}

module.exports = toBeContinued
