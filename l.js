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


	function loadScript(urlArr, callback, failCallback){
		var s = d.createElement('script');
		s.async = true;

		var failed = function(){
			if(urlArr.length > 1){
				urlArr.shift();
				s.parentNode.removeChild(s);
				unbind(s, 'error', failed);
				nonRenderBlocking(function(){
					loadScript(urlArr, callback, failCallback);
				});
			}
			else{
				failCallback();
			}
		};
		bind(s, 'error', failed);

		var loaded = function(){
			unbind(s, 'load', loaded);
			callback(urlArr[0]);
		};
		bind(s, 'load', loaded);

		s.src = urlArr[0];

		var f = d.scripts[0];
		f.parentNode.insertBefore(s, f);
	}

	function loadStyle(urlArr, callback, failCallback){
		var s = d.createElement('link');

		var failed = function(){
			if(urlArr.length > 1){
				urlArr.shift();
				s.parentNode.removeChild(s);
				unbind(s, 'error', failed);
				nonRenderBlocking(function(){
					loadScript(urlArr, callback, failCallback);
				});
			}
			else{
				failCallback();
			}
		};
		bind(s, 'error', failed);

		var loaded = function(){
			unbind(s, 'load', loaded);
			callback(urlArr[0]);
		};
		bind(s, 'load', loaded);

		s.href = urlArr[0];


		d.getElementsByTagName('head')[0].appendChild(s);

	}

	w.ljs = {
		script : function(urls, callback, failCallback){
			if(!isArr(urls)){
				urls = [urls];
			}
			if(!isFn(callback)){
				callback = function(){};
			}
			if(!isFn(failCallback)){
				failCallback = function(){};
			}

			nonRenderBlocking(function(){
				loadScript(urls, callback, failCallback);
			});

			
		},
		style : function(urls, callback, failCallback){
			if(!isArr(urls)){
				urls = [urls];
			}
			if(!isFn(callback)){
				callback = function(){};
			}
			if(!isFn(failCallback)){
				failCallback = function(){};
			}

			nonRenderBlocking(function(){
				loadStyle(urls, callback, failCallback);
			});

			
		},
		nrb : nonRenderBlocking
	};

	// //export our ljs object
	// w['ljs']['script'] = ljs.script;
	// w['ljs']['style'] = ljs.style;

})(document, window);
