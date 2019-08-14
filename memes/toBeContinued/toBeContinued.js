/*
 * ===============================================
 * CSS & JS version of toBeContinued meme from JoJo
 * origin: https://www.youtube.com/watch?v=70syHNphIQg
 * ===============================================
 */

// deps
const utils = require('../../deps/utils')

// assets
const memeTrack = require('./assets/roundabout.mp3')

// function that assumes to be passed to addEventListener, triggers toBeContinued meme
// (optional: {fnOnStart: Function, fnOnFinish: Function}) -> void
const toBeContinued = ({ fnOnStart, fnOnFinish } = {}) => {
  // prevent triggering if already activated 
  if (document.body.classList.contains('toBeContinued--activated')) return
  // create meme audio ringtone
  const ringtone = new Audio(memeTrack)
  // get custom events
  const {toBeContinuedOnStart, toBeContinuedOnFinish} = utils.createEvents('toBeContinued', toBeContinuedTerminate(ringtone,fnOnFinish))
  // dispatch custom event toBeContinuedStart
  document.body.dispatchEvent(toBeContinuedOnStart)
  // run optional onStart
  fnOnStart && fnOnStart()
  // run mem event
  toBeContinuedRun(ringtone, toBeContinuedOnFinish)
}


// simple procedure fn
// (ringtone: AudioElement, toBeContinuedOnFinish: CustomEvent) -> void
const toBeContinuedRun = (ringtone, toBeContinuedOnFinish, fnOnFinish ) => {
  // add initial class to body in order to prevent future meme activation
  // serves as state for terminate function
  document.body.classList.add('toBeContinued--activated')
  // activate ringtone
  ringtone.play() 
  // wrap future actions in a callback of listener 
  // only way of getting audio duration
  ringtone.onloadedmetadata = e => {
    // delay meme UI render until first part of ringtone is played
    utils.delay(addToBeContinuedUI)(4000)
    // delay finish part until all ringtone is played
    utils.delay(toBeContinuedFinish(toBeContinuedOnFinish, fnOnFinish))(e.target.duration * 1000)
  }
}


// run finish procedure
// (toBeContinuedFinish: CustomEvent, fnOnFinish: Function) -> () -> void 
const toBeContinuedFinish = (toBeContinuedOnFinish, fnOnFinish) => () => {
  console.log('finish is running')
  // check if still active (prevent delay functions to run) otherwise do nothing
  if (document.body.classList.contains('toBeContinued--activated')) {
    // clear at the end
    toBeContinuedCleanUp() 
    // dispatch custom event toBeContinuedOnFinish
    document.body.dispatchEvent(toBeContinuedOnFinish) 
    // run optional onFinish fn
    fnOnFinish && fnOnFinish()
  }
}


 /*
  * ==============================
  * toBeContinued Helper Functions
  * ==============================
  */

// fn that interrupts active toBeContinued mem event
// (ringtone: AudioElement) -> (fnOnFinish: Function) -> (toBeContinuedOnFinish: CustomEvent) -> () -> void
const toBeContinuedTerminate = (ringtone,fnOnFinish) => toBeContinuedOnFinish => () => {
  // remove state mark
  document.body.classList.remove('toBeContinued--activated')
  // stop playing audio 
  ringtone.pause()
  // proceed to finish part 
  toBeContinuedFinish(toBeContinuedOnFinish, fnOnFinish)()
}

// clear memes prints 
// stopPlaying: Function -> void
const toBeContinuedCleanUp = () => {
    // remove state mark
    document.body.classList.remove('toBeContinued--activated')
    // delay some procedures for smooth clearing
    removeToBeContinuedUI()
} 

// add toBeContinued UI
// () -> ()
const addToBeContinuedUI = () => {
  if (document.body.classList.contains('toBeContinued--activated')) {
    // add styling class to body 
    document.body.classList.add('toBeContinued--colorScheme')
    // add arrow
    addToBeContinuedArrow()
  }
}

// removes toBeContinued UI
// () -> ()
const removeToBeContinuedUI = () => {
  console.log('removing ui')
  // save arrow el in variable
  const arrow = document.getElementById('toBeContinued__arrow')
  // animate out arrow element
  arrow.classList.add('toBeContinued__arrow--out')
  // proceed to eliminate UI
  utils.delay(() => {
    // remove arrow element
    document.body.removeChild(arrow)
    // remove styling class from body
    document.body.classList.remove('toBeContinued--colorScheme')
  })(500)
}

// creates and appends arrow element to document.body
// () -> void
const addToBeContinuedArrow = () => {
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
