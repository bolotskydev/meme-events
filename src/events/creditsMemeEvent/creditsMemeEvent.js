/*
 * ===============================================
 * CSS & JS version of Curb Your Enthusiasm Credits meme
 * origin: https://www.youtube.com/watch?v=CdqMZ_s7Y6k
 * ===============================================
 */

// deps
import utils from '../../helpers/utils'

// assets
import memeTrack from './assets/credits.mp3'
import creditsStyles from './assets/creditsMemeEvent.css'

/*
 * ==============================
 * credits Helper Functions
 * ==============================
 */

// removes credits UI
// () -> void
const removeCreditsUI = () => {
  document.body.removeChild(document.body.querySelector('.credits__backdrop'))
}

// runs credits titles
// () -> void
const runCreditsTitles = () => {
  // save backdrop element into a variable
  const bd = document.body.querySelector('.credits__backdrop')
  // change titles 1 step
  utils.delay(() => {
    bd.innerHTML = `
      <h1>Executive Producer</h1>
      <p>larry david</p>
    `
  })(1000)
  // change titles 2 step
  utils.delay(() => {
    bd.innerHTML = `
      <h1>Executive Producer</h1>
      <p>jeff garlin</p>
    `
  })(2000)
}

// creates backdrop element and appends it to a body
// () -> void
const createCreditsBackdrop = () => {
  // prepare element structure
  const bd = document.createElement('div')
  bd.classList.add('credits__backdrop')
  bd.innerHTML = `
    <h1>Directed by</h1> 
    <p>robert b. weide</p>
  `
  document.body.appendChild(bd)
}

// clear memes prints
// () -> void
const creditsCleanUp = () => {
  // remove state mark
  document.body.classList.remove('credits--activated')
  // remove meme UI
  removeCreditsUI()
}

// add credits UI
// () -> void
const addCreditsUI = () => {
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
const creditsFinish = (creditsOnFinish, fnOnFinish) => () => {
  // check if still active (prevent delay functions to run) otherwise do nothing
  if (document.body.classList.contains('credits--activated')) {
    // perform clean up
    creditsCleanUp()
    // dispatch custom event creditsOnFinish
    document.body.dispatchEvent(creditsOnFinish)
    // run optional onFinish fn if exists
    fnOnFinish && fnOnFinish()
  }
}

// fn that interrupts active credits meme event execution
// (ringtone: AudioElement, fnOnFinish: Function, creditsOnFinish: Event, terminationFns: [...Arry]) -> Function -> void
const creditsTerminate = (
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
const creditsMemeEvent = ({ fnOnStart, fnOnFinish }) => () => {
  // prevent triggering if already activated
  if (document.body.classList.contains('credits--activated')) return
  // create meme audio ringtone
  const ringtone = new Audio(memeTrack)
  // add initial class to a body in order to prevent future meme activation
  // serves as state for the terminate function
  document.body.classList.add('credits--activated')
  // wrap future execution steps in a callback of onloadedmetadata listener in order to get acces to a duration prop
  ringtone.onloadedmetadata = e => {
    // wrap UI step into delay and get controls
    const clearAddUIWithDelay = () =>
      utils.delayWithControls(addCreditsUI)(1200)
    // create onFinish Custom Event
    const creditsOnFinish = utils.createEvent('credits', 'Finish', {
      bubbles: true,
    })
    // wrap finish step into delay and get clear fn back
    const clearRunFinishWithDelay = () =>
      utils.delayWithControls(creditsFinish(creditsOnFinish, fnOnFinish))(
        e.target.duration * 1000
      )
    // create onStart Custom Event
    const creditsOnStart = utils.createEvent('credits', 'Start', {
      bubbles: true,
      detail: {
        terminate: creditsTerminate(ringtone, fnOnFinish, creditsOnFinish, [
          clearAddUIWithDelay(),
          clearRunFinishWithDelay(),
        ]),
      },
    })
    // dispatch custom event creditsOnStart
    document.body.dispatchEvent(creditsOnStart)
    // run optional onStart fn if exists
    fnOnStart && fnOnStart()
  }
  // activate ringtone
  ringtone.play()
}

export { creditsMemeEvent, creditsStyles }
