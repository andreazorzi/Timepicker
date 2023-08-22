# Timepicker
Lightweight timepicker selector plugin, useful to avoid ugly default browser timepicker.

## Install
```bash
npm i @andreazorzi/timepicker
```

## Usage
### app.js
```javascript
// Timepicker
import Timepicker from "@andreazorzi/timepicker";
window.Timepicker = Timepicker;

// Locales
import timepicker_it from "@andreazorzi/timepicker/locale/it";
window.timepicker_it = timepicker_it;
```

### app.css
```css
@import "@andreazorzi/timepicker/timepicker.css";
```

### HTML
```html
<div class="timepicker">
    <input type="text" id="time" name="time">
</div>

<script>
    let time = new Timepicker("#time", options)
</script>
```

## Options List
```
{
    disabled: true, // set the field to readonly
	selected:{
	    hour: -1,  // sets hours and minutes default value,
	    minute: -1 // if the value is -1, the field value will be empty
	}
    lang: default_lang, // an array of translated texts, default locale: it
	am_pm: false // set AM / PM mode
}
```

## Methods
```js
// Open the modal
open()

// Close the modal
close()

// Get the current hour value
getHour()

// Get the current minute value
getMinute()

// Get the current am /pm selector value
getAmPm()

// Get current formatted time value
getFormattedTime()
```
