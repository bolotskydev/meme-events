<br/>

![GitHub package.json version](https://img.shields.io/github/package-json/v/BolotskyDev/meme-events)[![Build Status](https://travis-ci.org/BolotskyDev/meme-events.svg?branch=master)](https://travis-ci.org/BolotskyDev/meme-events) [![dependencies Status](https://david-dm.org/BolotskyDev/meme-events/status.svg)](https://david-dm.org/BolotskyDev/meme-events) [![devDependencies Status](https://david-dm.org/BolotskyDev/meme-events/dev-status.svg)](https://david-dm.org/BolotskyDev/?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
 <h1>meme-events</h1>
  <p>
    Plug-and-play CSS/JS versions of popular video memes
    <br />
    <br />
    <a href="https://github.com/BolotskyDev/meme-events/docs">View Demo</a>
     ·
    <a href="https://github.com/BolotskyDev/meme-events/issues">Report Bug</a>
    ·
    <a href="https://github.com/BolotskyDev/meme-events/issues">Request Feature</a>
   ·
    <a href="https://npmjs.com">Check NPM Registry Page</a>
  </p>
  




<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
  * [List of Events](#list-of-events)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
* [Basic Usage](#basic-usage)
* [Advanced Usage](#advanced-usage)
	* [MemeEvent Lifecycle](#memeevent-lifecycle)
	* [Optional Arguments](#optional-arguments)
* [Browser Support](#browser-support)
* [Contributing](#contributing)
* [License](#license)
* [Contacts](#contacts)

<!-- ABOUT THE PROJECT -->
## About The Project

Framework-agnostic dependency-free UI library that exposes to browser environment your favorite video memes, such as JoJo's [To Be Continued](https://www.youtube.com/watch?v=hn1PABkXLq0) or [Curb Your Enthusiasm Titles](https://www.youtube.com/watch?v=v2AzSDhYCNs).

Every meme is just a function that you can bind as a handler to any event you want w/o passing any arguments in its simplest form, making usage of this library easy breezy. 



### Built With

I promised you "no dependencies", but, of course, I didn't mean "no dev deps".

If you are going to contribute, keep in mind that this project uses:

* [Webpack](https://webpack.js.org/) stuffed with [Babel](https://babeljs.io), [postcss](https://postcss.org) and other bread-n-butter things for bundling into CDN version
* [Jest](https://jestjs.io) and [Test Cafe](https://devexpress.github.io) for unit/integration and e2e automated testing
* [Travis CI](https://travis-ci.com) for, well, you know
* [np](https://www.npmjs.com/package/np?activeTab=dependents) for publish management
* [ESLint](https://eslint.org) and [Prettier](https://prettier.io) for linting and formatting of all kind

### List Of Events

  **Currently implemented events:**
  - [JoJo's To Be Continued](https://www.youtube.com/watch?v=70syHNphIQg) 
  ```js
  import {toBeContinuedMemeEvent} from 'meme-events'
  import 'meme-events/src/events/toBeContinuedMemeEvent/toBeContinuedMemeEvent.css'
  ```
  - [Curb Your Enthusiasm Credits](https://www.youtube.com/watch?v=CdqMZ_s7Y6k)
  ```js
import {creditsMemeEvent} from 'meme-events`
import 'meme-events/src/events/creditsMemeEvent/creditsMemeEvent.css'
  ```

**Coming next:**
- [Be Right Back](https://www.youtube.com/watch?v=e53q3NrX2HI)
- [Shooting Star](https://www.youtube.com/watch?v=kCYPV8xlT2M)
- [FBI Open Up]([https://www.youtube.com/watch?v=08vk9g-jcsM](https://www.youtube.com/watch?v=08vk9g-jcsM))

_Warning! This project is extremely fun and easy to [contribute](#contributing). Don't hesitate to take a part!_

<!-- GETTING STARTED -->
## Getting Started

There is exactly 2 recommended ways to use meme-events: 
 - via CDN -> Option 1
 - via NPM registry -> Option 2

### Prerequisites
_Option 1_

In order to use meme-events via CDN you have to simply include these links in your ```<head>``` :

```html
<!-- Add the requiring meme-events.css for styling -->
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bolotskydev/meme-events/meme-eventd.css"/>
<!-- Add the requiring meme-events.js (keep in mind the script queue though) -->
<script defer src="//cdn.jsdelivr.ner/bolotskydev/meme-events/meme-events.js"></script>
```


_Option 2_

Using via npm is pretty much the same as with every other library, in your project directory type:

```sh
npm install --save meme-events
``` 
or
```sh
yarn add meme-events
```
Of course, you should have package.json initiated.

<!-- USAGE EXAMPLES -->
## Basic Usage

_Option 1_

In your main script you should be able to grab any existing meme events directly from the ```window``` object:
```js
const { toBeContinuedMemeEvent } = window
// yes, it is meant to be invoked there - every event
// uses currying to deliver optional args (none this time)
document.body.addEventListener('click', toBeContinuedMemeEvent())
```
_Option 2_

Then import what you need and bind as a handler.

**React**
```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { toBeContinuedMemeEvent, creditsMemeEvent} from 'meme-events'

// import css files of chosen events
import 'meme-events/src/events/toBeContinuedMemeEvent/toBeContinuedMemeEvent.css'
import 'meme-events/src/events/creditsMemeEvent/creditsMemeEvent.css'

const MemeEventsBtnsRow = props => {
	return (
		<>
			// setting first imported event as click handler for the first btn
			<button onClick={toBeContinuedMemeEvent()}>Click Me!</button>
			// setting second imported event as click handler for the second btn
			<button onClick={creditsMemeEvent()}>Click Me Too!</button>
		</>
	)
}

ReactDOM.render(<MemeEventsBtnsRow />, document.getElementById('root')) 

```
**Vue**
```vue
// @TODO
```
## Advanced Usage
### MemeEvent Lifecycle
Every meme event follows the same basic structure:
```js
// pseudocode
const DefaultMemeEvent = ({fnOnStart = () => {}, fnOnFinish = () => {} ={}) => event => {
	// checks if this event is already running to prevent multuple activation
	eventIsRunning()
	// dispatch custom event on body element whose name is consisted of
	// part that goes before 'MemeEvent', in this case 'Default' + 'OnStart'
	document.body.dispatchEvent('DefaultOnStart')
	// runs fnOnStart if exists, standard event object passed as an arg 
	fnOnStart && fnOnStart(event, terminate)
	// inner stuff that renders UI so on...
	innerStuff()
	//dispatch another custom event instance but with 'OnFinish' postfix
	document.body.dispatchEvent('DefaultOnFinish') 
	//runs fnOnFinish if exists, standard event obj passed as an arg
	fnOnFinish && fnOnFinish(event)
}
```
### Optional arguments
You can leverage these optional arguments and enhance your experience with meme-events by passing and object during binding handler to an event that contains ```fnOnStart``` or/and ```fnOnFinish```:
```js
document.body.addEventListener('click', toBeContinuedMemeEvent({
	fnOnStart: () => console.log('Event has been started'),
	fnOnFinish: () => console.log('Event has just finished')
}))
```
Same principles in React/Vue/Whatever.

Furthermore,  ```fnOnStart``` also receives initial ```event``` object and ```terminateEvent``` function and, just in case,```fnOnFinish``` receives the same ```event``` obj too. 
```js
const customFnObj = {
	fnOnStart: (event, terminateEvent) => {
		console.log(event.target) // -> outputs event src element
		document.body.onclick = function clickHandler () {
			terminateEvent() // -> immediately interrupts active event after any 
			                 // user click on the page and clears prints
			document.body.removeEventListener(clickHandler) // -> prevent
			                 // future illegal terminateEvent invocations
	},
	fnOnFinish: event => {
		...
	}
}

document.body.addEventListener('click', toBeContinuedMemeEvent(customFnObj))
``` 
Of course you could use everything above with plain old listeners and leave optional functions alone:
```js
document.body.addEventListener('MemeNameOnStart', e => {
	console.log(e.target) -> outputs same element
	document.body.onclick = function clickHandler () {
		e.detail.terminateEvent() // -> termination fn available in detail prop
		document.body.removeEventListener(clickHandler)
	},
})
document.body.addEventListener('MemeNameOnFinish', e=> {
	console.log(e.target)
})
document.body.addEventListener('click', MemeNameMemeEvent())
```

## Browser Support

Currently the most bleeding-edge features that get exploited in the library is Audio Element(), the rest if pretty basic ES6+ stuff that is handled by Babel anyway.

So, according to [caniuse](https://caniuse.com), it is pretty safe to think that compiled version of meme-events will fly on IE8+, Edge 12+ and therefore almost every version of Chrome & FF & Safari. 

The only exception its, of course, Opera Mini, but lets be honest, who cares.

<!-- CONTRIBUTING -->
## Contributing

meme-events is amazing place to start contributing to open source. It is written in pure ES6+, testing infrastructure is ready, no cumbersome async code is involved, no 3rd party API whatsoever besides requesting assets from Cloudinary.

However, there is a bunch of problem to be solved by you:
- consider adding more unit/int tests
- write automated e2e tests with Test Cafe
- help with implementing memes from _coming soon_ list
- implement your favorite meme on your own


Remember, even if you started coding like 2 weeks ago you are still able to correct typos or improve structure of this documentation, put in order issues section or just find funny meme to be included in library and request its implementation by adding to _coming soon_ list.

It works in both ways, actually, if you super experienced, it would be amazing if you could review source code and do some refactor, give some architecture or at least point to the bottlenecks to be removed and obvious mistakes to be fixed.

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Clone to your local machine
3. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
4. Do what you intended to do, considering overall project structure and keeping test coverage accordingly
5. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the Branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request
8. You are awesome!

**List of commands:**
_examples given with ```yarn```, but works with npm too_
- `yarn clean` - Remove `dist/` directory
- `yarn test` - Run all tests with linting and formatting.
- `yarn coverage` - Run all tests with coverage report.
- `yarn test:unit` - Run unit tests
- `yarn test:unit:watch` - Same but reruns on changes
- `yarn test:int` - Run integration tests
- `yarn test:int:watch` - Same but returns on changes
- `yarn lint` - Run ESlint 
- `yarn format` - Run Prettier 
- `yarn build` - Run Webpack.

**Last important note**
In already presented events there are some static assets like fonts and .mp3 files requested from my personal Cloudinary acc. Of course, I cannot make it public, so there are two pretty straightforward workarounds: use your own Cloudinary acc or keep assets locally. If your PR gets merged, I will move every static asset to my acc anyway.

Please, use issue and pull request templates that you may found in this repo. If you have any specific questions, feel free to contact me.



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contacts

Kirill Bolotsky - [Twitter](https://twitter.com/@bolotskyDev) - frontend@bolotsky.dev - [bolotsky.dev](https://bolotsky.dev)

Project Link: [https://github.com/github_username/repo](https://github.com/BolotskyDev/meme-events)
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTU5MTg4MDQ0MiwtNDQ0MzEwMDkwXX0=
-->