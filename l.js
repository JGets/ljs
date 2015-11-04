/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 John (Jack) Gettings
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
 
(function(d, w){
	"use strict";

	//Helper functions & polyfills
	function isFn(fn){
		return typeof(fn) === "function";
	}
	function isArr(arr){
		return toString.call(arr) === "[object Array]";
	}
	function bind(el, ev, fn){
		if(el.addEventListener){
			el.addEventListener(ev, fn, false);
		}
		else if(el.attachEvent){
			el.attachEvent('on'+ev, fn);
		}
		else{
			return false;
		}
	}
	function unbind(el, ev, fn){
		if(el.removeEventListener){
			el.removeEventListener(ev, fn, false);
		}
		else if(el.detachEvent){
			el.detachEvent('on'+ev, fn);
		}
	}


	/*
		Attempts to call func after animation frame, thereby making func (and anything it does)
		not block the page render.

		Note: if unable to request animation frame, it attempts to bind func to window.load,
			  if unable to bind to window.load, it immediately invokes func
	*/
	function nonRenderBlocking(func){
		var raf = null;
		try{
			raf = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame || null;
		}
		catch(e){}	//IE8 doesn't like requestAnimationFrame :(
		
		if(raf != null && typeof(raf) !== "undefined"){
			raf(func);
		}
		else{
			//can't request anim frame, so try to bind to window.load
			if(!bind(w, 'load', func)){
				func();	//Can't bind to window.load, so just call the func
			}
		}
	}


	/*
		Attempts to load a script from urlArr, stopping on the first to be successfully loaded.
		Invokes callback upon success, passing the URL of the successfully loaded script. Invokes
		failCallback if unable to load any of the passed URLs.
	*/
	function loadScript(urlArr, callback, failCallback){
		//create a new asycn script element
		var s = d.createElement('script');	
		s.async = true;

		//make a failure handler
		var failed = function(){
			//if there are other URLs we're supposed to fall-back on, 
			//attempt to use the next on in the list, recursively
			if(urlArr.length > 1){
				urlArr.shift();
				s.parentNode.removeChild(s);
				unbind(s, 'error', failed);
				nonRenderBlocking(function(){
					loadScript(urlArr, callback, failCallback);
				});
			}
			//otherwise, there are no other URLs to try, so invoke the user-passed fail callback
			else{
				failCallback();
			}
		};
		//bind our fail handler
		bind(s, 'error', failed);

		//create a handler for successful load, which just unbinds our loader,
		//and invokes the success callback, passing the URL that we had success with
		var loaded = function(){
			unbind(s, 'load', loaded);
			callback(urlArr[0]);
		};
		//bind our load hanlder
		bind(s, 'load', loaded);

		//set the new script element's src attribute
		s.src = urlArr[0];

		//add the new script element to the document, inserting it before the first script already on the page
		var f = d.scripts[0];
		f.parentNode.insertBefore(s, f);
	}


	/*
		Attempts to load a stylesheet from urlArr, stopping on the first one to be successfully loaded.
		Invokes callback upon success, passing the URL of the successfully loaded stylesheet. Invokes
		failCallback if unable to load any of the passed URLs.
	*/
	function loadStyle(urlArr, callback, failCallback){
		//create a new link element
		var s = d.createElement('link');

		//create our failuer handler
		var failed = function(){
			//if there are still other URLs to try, move on to the next one, recursively
			if(urlArr.length > 1){
				urlArr.shift();
				s.parentNode.removeChild(s);
				unbind(s, 'error', failed);
				nonRenderBlocking(function(){
					loadScript(urlArr, callback, failCallback);
				});
			}
			//otherwise, there aren't any other URLs to try, so just invoke the failure handler
			else{
				failCallback();
			}
		};
		//bind our fail handler
		bind(s, 'error', failed);

		//create a handler for when a style successfully loads
		var loaded = function(){
			unbind(s, 'load', loaded);	//unbind this handler
			callback(urlArr[0]);		//invoke the success callback, passing the successful URL
		};
		bind(s, 'load', loaded);	//bind the load handler

		//set the URL of the stylesheet/link element
		s.href = urlArr[0];

		//add the link element to the end of the <head> element (should be after all other stylesheets)
		d.getElementsByTagName('head')[0].appendChild(s);
	}


	//export our ljs object to the window
	w.ljs = {
		script : function(urls, callback, failCallback){
			//make sure the passed paremeters are of types we expect
			if(!isArr(urls)){
				urls = [urls];
			}
			if(!isFn(callback)){
				callback = function(){};
			}
			if(!isFn(failCallback)){
				failCallback = function(){};
			}
			//attempt to load the script without blocking
			nonRenderBlocking(function(){
				loadScript(urls, callback, failCallback);
			});
		},
		style : function(urls, callback, failCallback){
			//make sure the passed paremeters are of types we expect
			if(!isArr(urls)){
				urls = [urls];
			}
			if(!isFn(callback)){
				callback = function(){};
			}
			if(!isFn(failCallback)){
				failCallback = function(){};
			}
			//attempt to load the stylesheet without blocking
			nonRenderBlocking(function(){
				loadStyle(urls, callback, failCallback);
			});
		},
		nrb : nonRenderBlocking	//export our non-render blocking function as well for 3rd-party extension
	};

})(document, window);
