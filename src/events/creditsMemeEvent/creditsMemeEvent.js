/*
 * ===============================================
 * CSS & JS version of Curb Your Enthusiasm Credits meme
 * origin: https://www.youtube.com/watch?v=CdqMZ_s7Y6k
 * ===============================================
 */

// deps
import {delay, delayWithControls, initiate$, createEvent} from '../../helpers/utils'

// assets
import creditsMemeEventTrack from './assets/credits.mp3'
import creditsMemeEventStyles from './assets/creditsMemeEvent.css'

// introduce jQuery-like syntax
initiate$()
/* global $ */

/*
 * ==============================
 * credits Helper Functions
 * ==============================
 */

// removes credits UI
// () -> void
export const removeCreditsUI = () => {
  $('body')[0].removeChild($('.credits__backdrop')[0])
}

// runs credits titles
// () -> void
export const runCreditsTitles = () => {
  // save backdrop element into a variable
  const backdrop = $('.credits__backdrop')[0]
  // change titles 1 step
   delay(() => {
    backdrop.innerHTML = `
      <h1>Executive Producer</h1>
      <p>larry david</p>
    `
  })(1000)
  // change titles 2 step
   delay(() => {
    backdrop.innerHTML = `
      <h1>Executive Producer</h1>
      <p>jeff garlin</p>
    `
  })(2000)
}

// creates backdrop element and appends it to a body
// () -> void
export const createCreditsBackdrop = () => {
  // prepare element structure
  const backdrop = document.createElement('div')
  backdrop.classList.add('credits__backdrop')
  backdrop.innerHTML = `
    <h1>Directed by</h1> 
    <p>robert b. weide</p>
  `
  $('body')[0].appendChild(backdrop)
}

// clear memes prints
// () -> void
export const creditsCleanUp = () => {
  // remove state mark
  $('body')[0].classList.remove('credits--activated')
  // remove meme UI
  removeCreditsUI()
}

// add credits UI
// () -> void
export const addCreditsUI = () => {
  // create backdrop element and add it the body
  createCreditsBackdrop()
  // run credits
  runCreditsTitles()
}

/*
 * ===================================
 * CreditsMemeEvent Core Functionality
 * ===================================
 */

// run finish procedure
// (creditsFinish: Event, fnOnFinish: Function) -> () -> void
export const creditsFinish = (creditsOnFinish, fnOnFinish) => () => {
  // check if still active (prevent delay functions to run) otherwise do nothing
  if ($('body')[0].classList.contains('credits--activated')) {
    // perform clean up
    creditsCleanUp()
    // dispatch custom event creditsOnFinish
    $('body')[0].dispatchEvent(creditsOnFinish)
    // run optional onFinish fn if exists
    fnOnFinish && fnOnFinish()
  }
}

// fn that interrupts active credits meme event execution
// (ringtone: AudioElement, fnOnFinish: Function, creditsOnFinish: Event, terminationFns: [...Arry]) -> Function -> void
export const creditsTerminate = (
  ringtone,
  fnOnFinish,
  creditsOnFinish,
  terminationFns
) => () => {
  // stop playing audio
  ringtone.pause()
  // run set of terminatation functions
  terminationFns.length && terminationFns.forEach(fn => fn())
  // proceed to the finish part
  creditsFinish(creditsOnFinish, fnOnFinish)()
}

// main function of creditsMemeEvent
// ({fnOnStart?: Function, fnOnFinish?: Function}) -> () -> void
export const creditsMemeEvent = ({ fnOnStart, fnOnFinish }) => () => {
  // prevent triggering if already activated
  if ($('body')[0].classList.contains('credits--activated')) return
  // create meme audio ringtone
  const ringtone = new Audio(creditsMemeEventTrack)
  // add initial class to a body in order to prevent future meme activation
  // serves as state for the terminate function
  $('body')[0].classList.add('credits--activated')
  // wrap future execution steps in a callback of onloadedmetadata listener in order to get acces to a duration prop
  ringtone.onloadedmetadata = e => {
    // wrap UI step into delay and get controls
    const clearAddUIWithDelay = () =>
       delayWithControls(addCreditsUI)(1200)
    // create onFinish Custom Event
    const creditsOnFinish =  createEvent('credits', 'Finish', {
      bubbles: true,
    })
    // wrap finish step into delay and get clear fn back
    const clearRunFinishWithDelay = () =>
       delayWithControls(creditsFinish(creditsOnFinish, fnOnFinish))(
        e.target.duration * 1000
      )
    // create onStart Custom Event
    const creditsOnStart =  createEvent('credits', 'Start', {
      bubbles: true,
      detail: {
        terminate: creditsTerminate(ringtone, fnOnFinish, creditsOnFinish, [
          clearAddUIWithDelay(),
          clearRunFinishWithDelay(),
        ]),
      },
    })
    // dispatch custom event creditsOnStart
    $('body')[0].dispatchEvent(creditsOnStart)
    // run optional onStart fn if exists
    fnOnStart && fnOnStart()
  }
  // activate ringtone
  ringtone.play()
}

// aggregate for convenient export
const creditsMemeEventSet = {
  creditsMemeEvent,
  creditsMemeEventStyles,
}

export default creditsMemeEventSet
