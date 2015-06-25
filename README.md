# l.js

A small, dependency free, script to help in lazy/async loading of resources on a webpage.

`l.js` is designed to be small, simple, and to the point. It's meant to make lazy-loading reasources easy, with support for unreachable resource fallbacks.

## __*NOTE*__
This is still **EXPERIMENTAL** and not reccommended for production use. Use at your own risk.

## The Script
```html
<script type='text/javascript'>
	/* Copyright (C) 2015 John Gettings | MIT License : http://choosealicense.com/licenses/mit/  */
	!function(n,e){"use strict";function t(n){return"function"==typeof n}function r(n){return"[object Array]"===toString.call(n)}function o(n,e,t){if(n.addEventListener)n.addEventListener(e,t,!1);else{if(!n.attachEvent)return!1;n.attachEvent("on"+e,t)}}function i(n,e,t){n.removeEventListener?n.removeEventListener(e,t,!1):n.detachEvent&&n.detachEvent("on"+e,t)}function a(n){var t=null;try{t=requestAnimationFrame||mozRequestAnimationFrame||webkitRequestAnimationFrame||msRequestAnimationFrame||null}catch(r){}null!=t&&"undefined"!=typeof t?t(n):o(e,"load",n)||n()}function c(e,t,r){var u=n.createElement("script");u.async=!0;var f=function(){e.length>1?(e.shift(),u.parentNode.removeChild(u),i(u,"error",f),a(function(){c(e,t,r)})):r()};o(u,"error",f);var l=function(){i(u,"load",l),t(e[0])};o(u,"load",l),u.src=e[0];var s=n.scripts[0];s.parentNode.insertBefore(u,s)}function u(e,t,r){var u=n.createElement("link"),f=function(){e.length>1?(e.shift(),u.parentNode.removeChild(u),i(u,"error",f),a(function(){c(e,t,r)})):r()};o(u,"error",f);var l=function(){i(u,"load",l),t(e[0])};o(u,"load",l),u.href=e[0],n.getElementsByTagName("head")[0].appendChild(u)}e.ljs={script:function(n,e,o){r(n)||(n=[n]),t(e)||(e=function(){}),t(o)||(o=function(){}),a(function(){c(n,e,o)})},style:function(n,e,o){r(n)||(n=[n]),t(e)||(e=function(){}),t(o)||(o=function(){}),a(function(){u(n,e,o)})},nrb:a}}(document,window);
</script>
```

## Usage

<!-- `ljs.script(url, success, fail);`  
Use this to async load a javascript resource. -->

Documentation to come.


