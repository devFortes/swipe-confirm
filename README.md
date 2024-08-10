# SwipeConfirm

`SwipeConfirm` is a JavaScript class for creating a swipe-to-confirm component on your web pages. The component displays a text message that changes as the user slides a slider to the end.

![Swipe confirm](swipe-confirm.png)
<br/>
![Swipe cancel](swipe-cancel.png)


## Installation

You can install `SwipeConfirm` in two ways:

### Via NPM

If you're using NPM, add the package to your project:

```bash
npm install swipe-confirm
``` 


### Usage
Including in Your Project
After installation, you can import and use SwipeConfirm in your code.

CommonJS:
```bash
const SwipeConfirm = require('swipe-confirm');
``` 

ES Modules:
```bash
import SwipeConfirm from 'swipe-confirm';
``` 
### Example Usage

```bash
const swipe = new SwipeConfirm({
    id: 'swipe-container', 
    textSwipe: 'Swipe to confirm', 
    textConfirm: 'Confirmed', 
    borderRadius: '0px', 
    buttonBorderRadius: '0px',
	cancel: false
});
``` 

### Events

```bash
    // Resets the component to its initial state.
	swipe.reset();

	// Destroys the component and removes all events and styles.
	swipe.destroy();	

    swipe.on('swiped', () => {
		alert('Swipe has been completed');
	});
	
	swipe.on('reset', () => {
		console.log('Swipe reset!');
	});

	swipe.on('destroy', () => {
		console.log('Swipe destroyed!');
	});

``` 

### License

This project is licensed under the MIT License.
