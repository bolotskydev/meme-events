const eventCenter = {
  toBeContinuedMemeEvent: window.toBeContinuedMemeEvent,
  credits: window.toBeContinuedMemeEvent
} 


document.onreadystatechange = () => {
  $('#events-menu').on('change', e => {
    // clear previous   
  $('#events-btn')[0].on('click', e => {
    toBeContinuedMemeEvent()({
      fnOnStart: () => console.log('yeaaah'),
      fnOnFinish: () => console.log('noooo'),
    })
  })
  })
}
