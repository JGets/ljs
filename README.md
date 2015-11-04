# l.js

A small, dependency free, script to help in lazy/async loading of resources on a webpage.

`l.js` is designed to be small, simple, and to the point. It's meant to make lazy-loading resources easy, with support for unreachable resource fallbacks.

## __*NOTE*__
This is still **EXPERIMENTAL** and not recommended for production use. Use at your own risk.

## The Script
```html
<script type='text/javascript'>
	/* Copyright (C) 2015 John Gettings | MIT License : http://choosealicense.com/licenses/mit/  */
	!function(n,e){"use strict";function t(n){return"function"==typeof n}function r(n){return"[object Array]"===toString.call(n)}function o(n,e,t){if(n.addEventListener)n.addEventListener(e,t,!1);else{if(!n.attachEvent)return!1;n.attachEvent("on"+e,t)}}function i(n,e,t){n.removeEventListener?n.removeEventListener(e,t,!1):n.detachEvent&&n.detachEvent("on"+e,t)}function a(n){var t=null;try{t=requestAnimationFrame||mozRequestAnimationFrame||webkitRequestAnimationFrame||msRequestAnimationFrame||null}catch(r){}null!=t&&"undefined"!=typeof t?t(n):o(e,"load",n)||n()}function c(e,t,r){var u=n.createElement("script");u.async=!0;var f=function(){e.length>1?(e.shift(),u.parentNode.removeChild(u),i(u,"error",f),a(function(){c(e,t,r)})):r()};o(u,"error",f);var l=function(){i(u,"load",l),t(e[0])};o(u,"load",l),u.src=e[0];var s=n.scripts[0];s.parentNode.insertBefore(u,s)}function u(e,t,r){var u=n.createElement("link"),f=function(){e.length>1?(e.shift(),u.parentNode.removeChild(u),i(u,"error",f),a(function(){c(e,t,r)})):r()};o(u,"error",f);var l=function(){i(u,"load",l),t(e[0])};o(u,"load",l),u.href=e[0],n.getElementsByTagName("head")[0].appendChild(u)}e.ljs={script:function(n,e,o){r(n)||(n=[n]),t(e)||(e=function(){}),t(o)||(o=function(){}),a(function(){c(n,e,o)})},style:function(n,e,o){r(n)||(n=[n]),t(e)||(e=function(){}),t(o)||(o=function(){}),a(function(){u(n,e,o)})},nrb:a}}(document,window);
</script>
```

## Caveat
Unfortunately, event support for the `<link>` tag is severely lacking, and event support for the `<script>` tag is somewhat hit-and-miss, in most older (and some current) browsers. As such, callbacks, and URL fallbacks, for `ljs` may not work in these browsers. Async load functionality should be unaffected, but it will likely only attempt the first given url, and fail silently if that resource cannot be loaded.  

Therefore, it is recomended that no critical functionality be placed in any **callback functions** passed to `ljs`.

For more information on browser event support for `<link>` and `<script>` tags: [https://pie.gd/test/script-link-events/](https://pie.gd/test/script-link-events/)

## Usage
Remember to add `<noscript>`s to the `<head>` of the document with any scripts or stylesheets that will be lazy-loaded with `ljs`, for graceful degradation when the client browser has no javascript support.

### Scripts
`ljs.script(url [, success [, fail]] );`  
Use this to async load a javascript resource.   

| Parameters |   |   |
|------------|---|---|
| `url`      | **Required** | Can be either a string, or array of strings. If it is an array, `ljs` will attempt to load the first in the array, moving on to the second if it is unable to load the first, and continuing on through the array until it is successfully able to load a script. | 
| `success`  | Optional | A callback function to be triggered on successful load of a script. The given URL string of the script that was successfully loaded will be passed as the only parameter to this function. | 
| `fail`     | Optional | A callback function that will be triggered if *all* of the given URLs fail to load. It receives no parameters. |


-----------

### Stylesheets
`ljs.style(url [, success [, fail]] );`  
Use this function to async load a css stylesheet.

| Parameters |   |   |
|------------|---|---|
| `url`      | **Required** | Can be either a string, or array of strings. If it is an array, `ljs` will attempt to load the first in the array, moving on to the second if it is unable to load the first, and continuing on through the array until it is successfully able to load a script. | 
| `success`  | Optional | A callback function to be triggered on successful load of a stylesheet. The given URL string of the stylesheet that was successfully loaded will be passed as the only parameter to this function. | 
| `fail`     | Optional | A callback function that will be triggered if *all* of the given URLs fail to load. It receives no parameters. |


-----------

### Custom Non-Render-Blocking callbacks
`ljs.nrb(callback);`  
Use this function to make trigger custom callback functions, such that they don't cause a render block.

