/*
 * ===============================================
 * CSS & JS version of credits meme 
 * origin: https://www.youtube.com/watch?v=CdqMZ_s7Y6k
 * ===============================================
 */

// deps
const utils = require('../../deps/utils')

// assets
const memeTrack = require('./assets/credits.mp3')

// function that assumes to be passed to addEventListener, triggers credits meme event
// (options: {fnOnStart?: Function, fnOnFinish?: Function}) -> void
const creditsMemEvent = ({fnOnStart, fnOnFinish}) => {
  // prevent triggering if already activated 
  if (document.body.classList.contains('credits--activated')) return
  // create meme audio ringtone
  const ringtone = new Audio(memeTrack)
  // add initial class to body in order to prevent future meme activation
  // serves as state for terminate function
  document.body.classList.add('credits--activated')
  // wrap future actions in a callback of listener 
  // only way of getting audio duration
  ringtone.onloadedmetadata = e => {
    // wrap UI step into delay and get controls
    const clearAddUIWithDelay = () => utils.delayWithControls(addCreditsUI)(1000)
    // create onFinish Custom Event
    const creditsOnFinish = utils.createEvent('credits', 'Finish', {bubbles: true})
    // wrap finish step into delay and get controls
    const clearRunFinishWithDelay = () => utils.delayWithControls(creditsFinish(creditsFinish, fnOnFinish))(e.target.duration * 1000)
    // create onStart Custom Event
    const creditsOnStart = utils.createEvent('credits', 'Start', {bubbles: true, detail: {terminate: creditsTerminate(ringtone, fnOnFinish, creditsOnFinish, [clearAddUIWithDelay(), clearRunFinishWithDelay()])}})
    // dispatch custom event creditsOnStart
    document.body.dispatchEvent(creditsOnStart)
    // run optional onStart
    fnOnStart && fnOnStart()
  }
  // activate ringtone
  ringtone.play() 
} 


// fn that interrupts active credits meme event
// (ringtone: AudioElement,fnOnFinish: Function, creditsOnFinish: CustomEvent, terminationFns: [Function]) -> Function -> void
const creditsTerminate = (ringtone, fnOnFinish, creditsOnFinish ,terminationFns ) => () => {
  console.debug('Running Terminate Function')
  // stop playing audio 
  ringtone.pause()
  // run set of terminate functions
  terminationFns.length && terminationFns.forEach(fn => fn())
  // proceed to finish part 
  creditsFinish(creditsOnFinish, fnOnFinish)()
}


// run finish procedure
// (creditsFinish: CustomEvent, fnOnFinish: Function) -> () -> void 
const creditsFinish = (creditsOnFinish, fnOnFinish) => () => {
  // check if still active (prevent delay functions to run) otherwise do nothing
  if (document.body.classList.contains('credits--activated')) {
    // clear at the end
    creditsCleanUp() 
    // dispatch custom event creditsOnFinish
    document.body.dispatchEvent(creditsOnFinish) 
    // run optional onFinish fn
    fnOnFinish && fnOnFinish()
  }
}


 /*
  * ==============================
  * credits Helper Functions
  * ==============================
  */


// clear memes prints 
// stopPlaying: Function -> void
const creditsCleanUp = () => {
    // remove state mark
    document.body.classList.remove('credits--activated')
    // delay some procedures for smooth clearing
    removeCreditsUI()
} 

// add credits UI
// () -> ()
const addCreditsUI = () => {
    // create backdrop and add it the body
    createCreditsBackdrop()
    // run credits 
    runCreditsTitles()
}

// removes credits UI
// () -> ()
const removeCreditsUI = () => {
  //const bd = document.querySelector('credits--backdrop')
  document.body.removeChild('credits--backdrop')
}

// runs credits titles
// () -> void
const runCreditsTitles = () => {
  // save backdrop element into a variable
  const bd = document.querySelector('credits--backdrop')
  // change titles 1 step
  utils.delay(() => {
    bd.innerHTML = `
      <h1>Executive Producer</h1>
      <span>larry david</span>
    ` 
  }, 1000)
  // change titles 2 step
  utils.delay(() => {
    bd.innerHTML = `
      <h1>Executive Producer</h1>
      <span>jeff garlin</span>
    ` 
  }, 2000)
}

// creates backdrop element
// () -> void
const createCreditsBackdrop => {
  // create element
  const bd = document.createElement('div')
  bd.classList.add('credits--backdrop')
  bd.innerHTML = `
    <h1>Directed by</h1> 
    <span>robert b. weide</span>
  `
  document.body.appendChild(bd)
}

module.exports = creditsMemEvent
