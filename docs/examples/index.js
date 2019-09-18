// bunch of helpers

const currentEventState = (() => {
  const state = {
    el: document.getElementById('events-btn'),
    event: window[document.getElementById('events-menu').value](),
  }
  return {
    getElement: () => state.el,
    setElement: newElement => (state.el = newElement),
    getEvent: () => state.event,
    setEvent: newEvent => (state.event = newEvent),
  }
})()

const setCurrentEventState = (prevState, event) => {
  prevState.setEvent(window[event]())
}

const boundEventToElement = (currentState = currentEventState) => {
  currentState.getElement().addEventListener('click', currentState.getEvent())
}

const unboundEventFromElement = (currentState = currentEventState) => {
  currentState
    .getElement()
    .removeEventListener('click', currentState.getEvent())
}

// main script

boundEventToElement(currentEventState)

document.getElementById('events-menu').onchange = e => {
  unboundEventFromElement()
  setCurrentEventState(currentEventState, e.target.value)
  boundEventToElement()
}
