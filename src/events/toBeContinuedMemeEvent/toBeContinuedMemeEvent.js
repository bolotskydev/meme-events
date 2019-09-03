/*
 * ===============================================
 * CSS & JS version of toBeContinued meme from JoJo
 * origin: https://www.youtube.com/watch?v=70syHNphIQg
 * ===============================================
 */

// deps
import {
  delay,
  delayWithControls,
  initiate$,
  createEvent,
  removeNode
} from '../../helpers/utils'
// assets
import toBeContinuedTrack from './assets/roundabout.mp3'
import toBeContinuedMemeEventStyles from './assets/toBeContinuedMemeEvent.css'

// introduce jQuery-like syntax
initiate$()

/* global $ */

/*
 * ==============================
 * toBeContinued Helper Functions
 * ==============================
 */

// removes toBeContinued UI
// () -> void
export const removeToBeContinuedUI = () => {
  // save arrow el in variable
  const arrow = $('#toBeContinued__arrow')[0]
  // proceed if arrow exists
  if (arrow) {
    // animate out arrow element
    arrow.classList.add('toBeContinued__arrow--out')
    // proceed to eliminate UI with delay for animation purpose
    delay(() => {
      // remove arrow element
      removeNode(arrow)
      // remove styling class from body
      $('body')[0].classList.remove('toBeContinued--colorScheme')
    })(500)
  }
}

// creates and appends arrow element to a body
// () -> void
export const addToBeContinuedArrow = () => {
  // prepare html structure
  const arrow = document.createElement('div')
  arrow.classList.add('toBeContinued__arrow')
  arrow.id = 'toBeContinued__arrow'
  // set inner html to a svg arrow
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
  $('body')[0].appendChild(arrow)
}

// clear memes prints
// () -> void
export const toBeContinuedCleanUp = () => {
  // remove state mark
  $('body')[0].classList.remove('toBeContinued--activated')
  // remove meme event UI
  removeToBeContinuedUI()
}

// add toBeContinued UI
// () -> void
export const addToBeContinuedUI = () => {
  // add styling class to a body
  $('body')[0].classList.add('toBeContinued--colorScheme')
  // add arrow element
  addToBeContinuedArrow()
}

/*
 * ============================
 * toBeContinued Core Functions
 * ============================
 */

// runs finish procedure
// (toBeContinuedFinish: Event, fnOnFinish: Function) -> () -> void
export const toBeContinuedFinish = (
  toBeContinuedOnFinish,
  fnOnFinish
) => () => {
  // check if still active (prevent delay functions to run) otherwise do nothing
  if ($('body')[0].classList.contains('toBeContinued--activated')) {
    // perform clean up
    toBeContinuedCleanUp()
    // dispatch custom event toBeContinuedOnFinish
    $('body')[0].dispatchEvent(toBeContinuedOnFinish)
    // run optional onFinish fn if exists
    if (fnOnFinish) fnOnFinish()
  }
}

// fn that interrupts active toBeContinued meme event if called
// (ringtone: AudioElement, fnOnFinish: Function, toBeContinuedOnFinish: Event, terminationFns: [...Arry]) -> Function -> void
export const toBeContinuedTerminate = (
  ringtone,
  fnOnFinish,
  toBeContinuedOnFinish,
  terminationFns
) => () => {
  // stop playing audio
  ringtone.pause()
  // run set of terminate functions
  terminationFns.length && terminationFns.forEach(fn => fn())
  // proceed to the finish part
  toBeContinuedFinish(toBeContinuedOnFinish, fnOnFinish)()
}

// main event function
// ({fnOnStart?: Function, fnOnFinish?: Function}) -> () -> void
export const toBeContinuedMemeEvent = ({
  fnOnStart,
  fnOnFinish,
} = {}) => () => {
  // prevent triggering if already activated
  if ($('body')[0].classList.contains('toBeContinued--activated')) return
  // create meme audio ringtone
  const ringtone = new Audio(toBeContinuedTrack)
  // add initial class to the body in order to prevent future meme activation
  // serves as a state for the terminate function
  $('body')[0].classList.add('toBeContinued--activated')
  // wrap future execution steps in a callback of onloadedmetadata listener in order to work with duration prop
  ringtone.onloadedmetadata = e => {
    // wrap UI step into delay helper and get timeout control back
    const clearAddUIWithDelay = () =>
      delayWithControls(addToBeContinuedUI)(4000)
    // create onFinish Custom Event
    const toBeContinuedOnFinish = createEvent('toBeContinued', 'Finish', {
      bubbles: true,
    })
    // wrap finish step into delay and get controls
    const clearRunFinishWithDelay = () =>
      delayWithControls(toBeContinuedFinish(toBeContinuedOnFinish, fnOnFinish))(
        e.target.duration * 1000
      )
    // create onStart Custom Event
    const toBeContinuedOnStart = createEvent('toBeContinued', 'Start', {
      bubbles: true,
      detail: {
        terminate: toBeContinuedTerminate(
          ringtone,
          fnOnFinish,
          toBeContinuedOnFinish,
          [clearAddUIWithDelay(), clearRunFinishWithDelay()]
        ),
      },
    })
    // dispatch custom event toBeContinuedStart
    $('body')[0].dispatchEvent(toBeContinuedOnStart)
    // run optional onStart fn if exists
    fnOnStart && fnOnStart()
  }
  // activate ringtone
  ringtone.play()
}

// aggregate for convenient export
const toBeContinuedMemeEventSet = {
  toBeContinuedMemeEvent,
  toBeContinuedMemeEventStyles,
}

export default toBeContinuedMemeEventSet
