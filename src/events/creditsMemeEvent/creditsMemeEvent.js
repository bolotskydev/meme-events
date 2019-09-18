/*
 * ===============================================
 * CSS & JS version of Curb Your Enthusiasm Credits meme
 * origin: https://www.youtube.com/watch?v=CdqMZ_s7Y6k
 * ===============================================
 */

// deps
import {
  removeNode,
  delay,
  delayWithControls,
  createEvent,
} from '../../helpers/utils'

/* workaround to include css into webpack build */
/* eslint-disable-next-line no-unused-vars */
import creditsMemeEventStyles from './creditsMemeEvent.css'

/*
 * ==============================
 * credits Helper Functions
 * ==============================
 */

// removes credits UI
// () -> void
export const removeCreditsUI = () => {
  removeNode(document.querySelector('.credits__backdrop'))
}

// runs credits titles
// () -> void
export const runCreditsTitles = () => {
  // save backdrop element into a variable
  const backdrop = document.querySelector('.credits__backdrop')
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
export const addCreditsBackdrop = () => {
  // prepare element structure
  const backdrop = document.createElement('div')
  backdrop.classList.add('credits__backdrop')
  backdrop.innerHTML = `
    <h1>Directed by</h1> 
    <p>robert b. weide</p>
  `
  document.body.appendChild(backdrop)
}

// clear memes prints
// () -> void
export const creditsCleanUp = () => {
  // remove state mark
  document.body.classList.remove('credits--activated')
  // remove meme UI
  removeCreditsUI()
}

// add credits UI
// () -> void
export const addCreditsUI = () => {
  // create backdrop element and add it the body
  addCreditsBackdrop()
  // run credits
  runCreditsTitles()
}

/*
 * ===================================
 * CreditsMemeEvent Core Functionality
 * ===================================
 */

// run finish procedure
// (creditsOnFinish: Event, fnOnFinish?: Function) -> () -> void
export const creditsFinish = (
  creditsOnFinish = new CustomEvent('DefaultCreditsMemeEvent', {
    bubbles: true,
  }),
  fnOnFinish
) => () => {
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
// (ringtone: AudioElement,  creditsOnFinish: Event, terminationFns: [...Arry], fnOnFinish?: Function,) -> Function -> void
export const creditsTerminate = (
  ringtone,
  creditsOnFinish,
  terminationFns = [],
  fnOnFinish
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
export const creditsMemeEvent = ({ fnOnStart, fnOnFinish } = {}) => () => {
  // prevent triggering if already activated
  if (document.body.classList.contains('credits--activated')) return
  // create meme audio ringtone
  const ringtone = new Audio(
    'https://res.cloudinary.com/bolotskydev/video/upload/v1568286768/meme-events/credits.mp3'
  )
  // add initial class to a body in order to prevent future meme activation
  // serves as state for the terminate function
  document.body.classList.add('credits--activated')
  // wrap future execution steps in a callback of onloadedmetadata listener in order to get acces to a duration prop
  ringtone.onloadedmetadata = e => {
    // wrap UI step into delay and get controls
    const clearAddUIWithDelay = () => delayWithControls(addCreditsUI)(1200)
    // create onFinish Custom Event
    const creditsOnFinish = createEvent('credits', 'Finish', {
      bubbles: true,
    })
    // wrap finish step into delay and get clear fn back
    const clearRunFinishWithDelay = () =>
      delayWithControls(creditsFinish(creditsOnFinish, fnOnFinish))(
        e.target.duration * 1000
      )
    // create onStart Custom Event
    const creditsOnStart = createEvent('credits', 'Start', {
      bubbles: true,
      detail: {
        terminate: creditsTerminate(
          ringtone,
          creditsOnFinish,
          [clearAddUIWithDelay(), clearRunFinishWithDelay()],
          fnOnFinish
        ),
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

export default creditsMemeEvent
