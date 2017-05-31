(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('window'), require('document')) :
	typeof define === 'function' && define.amd ? define(['window', 'document'], factory) :
	(global.UProgress = factory(global.window,global.document));
}(this, (function (window,document) { 'use strict';

window = window && window.hasOwnProperty('default') ? window['default'] : window;
document = document && document.hasOwnProperty('default') ? document['default'] : document;

/**
     * Debounce callback execution
     */
function debounce(fn, threshold, isAsap) {
    var timeout, result;
    function debounced() {
        var args = arguments,
            context = this;
        function delayed() {
            if (!isAsap) {
                result = fn.apply(context, args);
            }
            timeout = null;
        }
        if (timeout) {
            clearTimeout(timeout);
        } else if (isAsap) {
            result = fn.apply(context, args);
        }
        timeout = setTimeout(delayed, threshold);
        return result;
    }
    debounced.cancel = function () {
        clearTimeout(timeout);
    };
    return debounced;
}

var debounce_1 = debounce;

/**
     * Clamps value inside range.
     */
function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
}
var clamp_1 = clamp;

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
var CSS_PREFIXES = ['Webkit', 'O', 'Moz', 'ms'];
var PREFIXED_EVENT_NAMES = {
  transition: 'transitionend',
  MozTransition: 'mozTransitionEnd',
  OTransition: 'oTransitionEnd',
  WebkitTransition: 'webkitTransitionEnd'
};
var PREFIXED_PROP_CACHE = {};

var TRANSITION_END_EVENT = PREFIXED_EVENT_NAMES[getVendorProp('transition')];

/**
 * ------------------------------------------------------------------------
 * Public methods
 * ------------------------------------------------------------------------
 */

/**
 * Trigger a reflow on an element.
 *
 * @method reflow
 * @param {HTMLElement} element the element to reflow
 */
function reflow(element) {
  // eslint-disable-next-line no-unused-expressions
  element.offsetHeight;
}

/**
 * Set a style property of an element.
 *
 * @method style
 * @param {HTMLElement} element the element on which to set the style property.
 * @param {string} prop the CSS property to set.
 * @param {string|number} value the value to set.
 */
function style(element, prop, value) {
  element.style[getVendorProp(prop)] = value;
}

/**
 * Set multiple style properties of an element.
 *
 * @method styles
 * @param {HTMLElement} element the element on which to set the style property.
 * @param {Object<string, Any>} props a hash of CSS properties and values to set.
 */
function styles(element, props) {
  for (var i = 0, keys = Object.keys(props), length = keys.length; i < length; i++) {
    style(element, keys[i], props[keys[i]]);
  }
}

/**
 * Get the camel case vendor prefixed version of a style attribute, if the browser doesn't support the unprefixed one.
 *
 * @method getVendorProp
 * @param {string} name the unprefixed camel case attribute
 * @return {string} the attribute supported by the browser
 */
function getVendorProp(name) {
  if (PREFIXED_PROP_CACHE[name]) {
    return PREFIXED_PROP_CACHE[name];
  }

  if (!(name in document.body.style)) {
    for (var i = 0, length = CSS_PREFIXES.length; i < length; i++) {
      var vendorName = '' + CSS_PREFIXES[i] + name.charAt(0).toUpperCase() + name.slice(1);

      if (vendorName in document.body.style) {
        PREFIXED_PROP_CACHE[name] = vendorName;
        return vendorName;
      }
    }
  }
  PREFIXED_PROP_CACHE[name] = name;
  return name;
}

/**
 * Get the kebab case version of a style attribute, unprefixed if the browser support it, prefixed otherwise.
 *
 * @method getVendorCSSProp
 * @param {String} name the unprefixed camel case attribute
 * @return {String} the attribute supported by the browser
 */
function getVendorCSSProp(name) {
  return getVendorProp(name).replace(/([A-Z])/g, function (str, m1) {
    return '-' + m1.toLowerCase();
  }).replace(/^ms-/, '-ms-');
}

/**
 * Execute a start function that trigger a transition, and if an end function is defined,
 * call it when the transition is over, for the given property.
 *
 * @method transition
 * @param {HTMLElement} element The element that will transition when the start function is called
 * @param {function} start a function that trigger the transition on element
 * @param {function} end the function to call when the transition ends
 * @param {boolean} immediate true to call the end function immediatly
 * @param {string} property the property that transition; end function will be called only at the end of the transition on that property
 */
function transition(element, start, end, immediate, property) {
  if (end) {
    if (immediate) {
      setTimeout(end);
    } else {
      var handler = function handler(event) {
        if (!property || event.propertyName === getVendorCSSProp(property)) {
          end(event);
          element.removeEventListener(TRANSITION_END_EVENT, handler);
        }
      };

      element.addEventListener(TRANSITION_END_EVENT, handler);
    }
  }
  start();
}

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/*
 * ------------------------------------------------------------------------
 * Global variables
 * ------------------------------------------------------------------------
 */

/**
 * Used to generate sequential id to save active UProgresses in allProgress
 * @private
 * @type {number}
 */
var keyCounter = 0;
/**
 * Store active UProgresses (so the resize listener can be shared across instances)
 *
 * @private
 * @type {Object}
 */
var allUProgress = {};
/**
 * Default options for all new {@link UProgress} instances.
 *
 * @private
 * @type {Object}
 * @see UProgress.default
 */
var DEFAULT = Object.seal({
  rtl: false,
  start: 0.01,
  end: 0.99,
  duration: 25000,
  doneDuration: 100,
  fadeDuration: 200,
  class: 'uprogress',
  barClass: 'bar',
  blurClass: 'blur',
  resizeDebounce: 300
});
/**
 * Global function registered once to the window `resize` event. On window `resize` event, calls {@link UProgress#refresh} for each exixsting instances.
 * Debounced with threshold defined in `UProgress.Default.resizeDebounce`.
 *
 * @private
 * @type {function}
 */
var _onResize = debounce_1(function () {
  for (var i = 0, keys = Object.keys(allUProgress), length = keys.length; i < length; i++) {
    var uProgress = allUProgress[keys[i]];

    if (uProgress._parent.contains(uProgress._wrapper)) {
      uProgress.refresh();
    } else {
      uProgress.destroy();
    }
  }
}, DEFAULT.resizeDebounce);

/*
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

/**
 * Creates and control a µProgress.
 * @class
 */

var UProgress = function () {
  /**
   * - Create a new UProgress instance.
   * - Create a `div` for the µProgress and add it to the `parent`.
   * - Register to the `resize` event.
   *
   * @instance
   * @constructor
   * @param {HTMLElement} [parent=document.body] The `HTMLElement` on which the µProgress will stand on top of.
   * @param {Object} [opts] The µProgress configutation.
   * @param {boolean} [rtl=false] `true` to move the µProgress from right to left, `false` for left to right.
   * @param {number} [opts.start=0.01] The position in percentage (.35 is 35%, 1 is 100%) at which the µProgress starts.
   * @param {number} [opts.end=0.99] The position in percentage (.35 is 35%, 1 is 100%) the µProgress is moving toward when started. Once reached, it will stop until {@link UProgress#set} or {@link UProgress#done} are called.
   * @param {number} [opts.duration=25000] The durarion in ms it takes for the µProgress to go from `opts.start` to `opts.end`.
   * @param {number} [opts.doneDuration=100] The duration in ms that the µProgress take to complete when {@link UProgress#done} is called.
   * @param {number} [opts.fadeDuration=200] The duration in ms the µProgress takes to fade out after it has completed.
   * @param {number} [opts.class='uprogress'] The CSS class to set on the µProgress element.
   * @param {number} [opts.barClass='bar'] The CSS class to set on the µProgress bar element.
   * @param {number} [opts.blurClass='blur'] The CSS class to set on the µProgress blur element.
   *
   * @example
   * Create a new µProgress on top of the viewport with default options.
   * ```javascript
   * const uProgress = new UProgress();
   * uProgress.start();
   * ```
   * @example
   * Create a new µProgress on top of a modal with default options.
   * ```javascript
   * const uProgress = new UProgress(document.getElementById('my-modal'));
   * uProgress.start();
   * ```
   * @example
   * Create a new µProgress on top of the viewport with custom options.
   * ```javascript
   * const uProgress = new UProgress({
   *   start: 0.05,
   *   duration: 30000
   * });
   * uProgress.start();
   * ```
   */
  function UProgress() {
    var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    var opts = arguments[1];
    classCallCheck(this, UProgress);

    this._wrapper = document.createElement('div');
    this._progressbar = document.createElement('div');
    this._blur = document.createElement('div');
    if (arguments.length === 1 && !(parent instanceof HTMLElement)) {
      this._parent = document.body;
      this._options(parent, DEFAULT);
    } else {
      this._options(opts, DEFAULT);
      this._parent = parent;
    }
    this._progressbar.className = this._opts.barClass;
    this._progressbar.setAttribute('role', 'bar');
    this._wrapper.appendChild(this._progressbar);
    this._blur.className = this._opts.blurClass;
    this._progressbar.appendChild(this._blur);
    this._width = this._parent === document.body ? Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth) : this._parent.clientWidth;
    this._key = keyCounter;
    this._started = false;
    this._completing = false;
    this._destroyed = false;
    this._to = null;
    this._from = null;
    this._duration = null;
    this._end = null;
    this._rtl = false;
    styles(this._wrapper, {
      width: this._width + 'px',
      position: this._parent === document.body ? 'fixed' : 'absolute'
    });
    styles(this._progressbar, {
      visibility: 'hidden',
      width: this._width + 'px'
    });
    this._parent.appendChild(this._wrapper);
    if (Object.keys(allUProgress).length === 0) {
      window.addEventListener('resize', _onResize);
    }
    allUProgress[this._key] = this;
    keyCounter += 1;
  }

  /*
   * ------------------------------------------------------------------------
   * Public methods
   * ------------------------------------------------------------------------
   */

  /**
   * Display the µProgress and start its progress from `opts.start` to `opts.end` at a speed corresponding to `opts.duration`. Has no effect if the µProgress is already started.
   *
   * @method start
   * @memberof UProgress
   * @instance
   * @return {boolean} `true` if the µProgress has started, `false` otherwise.
   *
   * @example
   * Start the µProgress.
   * ```javascript
   * const uProgress = new UProgress();
   * uProgress.start();
   * // true
   * ```
   */


  UProgress.prototype.start = function start() {
    if (!this._started && !this._completing) {
      this._from = this._opts.start;
      this._rtl = this._opts.rtl;
      this._wrapper.className = '' + this._opts.class + (this._rtl ? ' rtl' : '');
      // Initialize µProgress and position it at 'start'
      styles(this._progressbar, {
        transition: 'none',
        transform: 'translateX(' + this._targetToPosition(this._opts.start) + 'px)',
        opacity: 1,
        visibility: 'visible'
      });
      reflow(this._progressbar);
      this._started = true;
      return this._set(this._opts.duration, this._opts.end);
    }
    return false;
  };

  /**
   * Change the µProgress `target` and the speed at which it reaches it. Useful to give a more accurate progress of multiple sequentials tasks.
   * If the value of `duration` parameter is equal or greater than 1, then the µProgress will automatically fade out once it reaches 100% progress (equivalent to calling {@link UProgress#done} with `opts.doneDuration` = `duration`).
   *
   * @method set
   * @memberof UProgress
   * @instance
   * @param {number} duration The duration in ms the µProgress will take to reach its `target`.
   * @param {number} [target] The position in percentage (.35 is 35%, 1 is 100%) the µProgress will moving toward. Once reached, it will stop until {@link UProgress#set} or {@link UProgress#done} are called. If `undefined` or `null`, the µProgress target will stay the same.
   * @param {boolean} [force=false] `true` to set the requested `target` even if ti makes the µProgress moves backward.
   * @return {boolean} `true` if the µProgress `duration` or `target` has been changed, `false` otherwise.
   *
   * @example
   * Update µProgress speed based on tasks progress.
   * ```javascript
   * // doHeavyTask calls a callback when done and is expected to takes up to 7s
   * // doLightTask calls a callback when done and is expected to takes up to 3s
   * const uProgress = new UProgress({
   *   duration: 7000
   *   end: 0.7
   * });
   * uProgress.start();
   * doHeavyTask(() => {
   *   // when heavy task is done
   *   uProgress.set(3000, .99);
   *   doLightTask(() => {
   *     // When light task is done
   *     uProgress.done();
   *   });
   * });
   * ```
   */


  UProgress.prototype.set = function set$$1(duration) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._to;
    var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (this._started && !this._completing) {
      if (target !== null && target >= 1) {
        return this._done(false, duration, this._opts.fadeDuration);
      }
      if (target === null || force || this._status().progress < target) {
        return this._set(duration, target === null ? this._to : Math.max(target, this._opts.start), force);
      }
    }
    return false;
  };

  /**
   * Gracefully complete the µProgress by moving quickly to 100% progress and then fading out. It will moves to 100% at the speed corresponding to `opts.doneDuration` and then fade out with the duration of `opts.fadeDuration`.
   * Has no effect if the µProgress is not started or if {@link UProgress#done}).
   *
   * @method done
   * @memberof UProgress
   * @instance
   * @param  {boolean} destroy `true` to automatically call {@link UProgress#destroy} once the µProgress has completed.
   * @return {boolean} `true` if the µProgress is going to be completed, `false` otherwise.
   *
   * @example
   * Complete the µProgress once the monitored task is done.
   * ```javascript
   * // `doTask` calls a callback when done
   * const uProgress = new UProgress();
   * uProgress.start();
   * doTask(() => {
   *   // when task is done,
   *   uProgress.done();
   * });
   * ```
   */


  UProgress.prototype.done = function done(destroy) {
    return this._done(destroy, this._opts.doneDuration, this._opts.fadeDuration);
  };

  /**
   * Status of the µProgress instance.
   *
   * @typedef {Object} Status
   * @memberof UProgress
   * @inner
   * @property {number} target The position in percentage (.35 is 35%, 1 is 100%) the µProgress is moving toward. Once reached, it will stop until {@link UProgress#set} or {@link UProgress#done} are called.
   * @property {number} duration The duration in ms left to reach the position `Status.target`. Only returned if the µProgress is started.
   * @property {number} progress The current progress in percentage (.35 is 35%, 1 is 100%). Only returned if the µProgress is started.
   */

  /**
   * Get the {@link UProgress~Status} of the µProgress if it's not destroyed, `false` otherwise.
   *
   * @method status
   * @memberof UProgress
   * @instance
   * @return {Status|boolean} The current {@link UProgress~Status} or `false`.
   *
   * @example
   * Get the status.
   * ```javascript
   * const uProgress = new UProgress({duration: 20000});
   * uProgress.start();
   * setTimeout(() => {
   *   uProgress.status();
   *   // {target: 0.99, duration: 15000, progress: 0.25}
   * }, 5000);
   * ```
   */


  UProgress.prototype.status = function status() {
    return this._destroyed ? false : this._status();
  };

  /**
   * Update the µProgress instance configuration.
   *
   * @method options
   * @memberof UProgress
   * @instance
   * @param {Object} [opts] The µProgress configutation.
   * @param {boolean} [rtl=false] `true` to move the µProgress from right to left, `false` for left to right.Will be used on next call to {@link UProgress#start}.
   * @param {number} [opts.start=0.01] The position in percentage (.35 is 35%, 1 is 100%) at which the µProgress starts. Will be used on next call to {@link UProgress#start}.
   * @param {number} [opts.end=0.99] The position in percentage (.35 is 35%, 1 is 100%) the µProgress is moving toward when started. Once reached, it will stop until {@link UProgress#set} or {@link UProgress#done} are called. Will be used on next call to {@link UProgress#start}.
   * @param {number} [opts.duration=25000] The durarion in ms it takes for the µProgress to go from `opts.start` to `opts.end`. Will be used on next call to {@link UProgress#start}.
   * @param {number} [opts.doneDuration=100] The duration in ms that the µProgress take to complete when {@link UProgress#done} is called. Will be used on next call to {@link UProgress#done}.
   * @param {number} [opts.fadeDuration=200] The duration in ms the µProgress takes to fade out after it has completed. Will be used on next call to {@link UProgress#done}.
   * @param {number} [opts.class='uprogress'] The CSS class to set on the the µProgress element. Will be applied right away.
   * @param {number} [opts.barClass='bar'] The CSS class to set on the the µProgress bar element. Will be applied right away.
   * @param {number} [opts.blurClass='blur'] The CSS class to set on the the µProgress blur element. Will be applied right away.
   * @return {UProgress} this, chainable
   *
   * @example
   * Change duration.
   * ```javascript
   * const uProgress = new UProgress();
   * uProgress.options({duration: 20000}).start();
   * setTimeout(() => {
   *   uProgress.status();
   *   // {target: 0.99, duration: 5000, progress: 0.75}
   * }, 15000);
   * ```
   */


  UProgress.prototype.options = function options(opts) {
    this._options(opts);
    return this;
  };

  /**
   * Update the µProgress with and position based on its parent width. This methods is automatically called on a window `resize` event. However it has to be called manually if the parent container width changes for a reason other than a window resize.
   *
   * @method refresh
   * @memberof UProgress
   * @instance
   *
   * @example
   * Create a new µProgress on top of a modal and change it's width.
   * ```javascript
   * const uProgress = new UProgress(document.getElementById('my-modal'));
   * // Modify the modal content (i.e. refresh content with Ajax)
   * changeModalContent();
   * uProgress.refresh();
   * ```
   */


  UProgress.prototype.refresh = function refresh() {
    var parentWidth = this._parent === document.body ? Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth) : this._parent.clientWidth;

    if (parentWidth !== this._width) {
      var transitionProgress = 1 - this._progressbar.getBoundingClientRect().left / (this._width * (this._rtl ? 1 : -1));

      this._width = parentWidth;
      style(this._wrapper, 'width', this._width + 'px');
      style(this._progressbar, 'width', this._width + 'px');
      if (this._started) {
        styles(this._progressbar, {
          transition: 'none',
          transform: 'translateX(' + this._targetToPosition(transitionProgress) + 'px)'
        });
        reflow(this._progressbar);
        styles(this._progressbar, {
          transition: getVendorCSSProp('transform') + ' ' + this._status().duration + 'ms linear',
          transform: 'translateX(' + this._targetToPosition(this._to) + 'px)'
        });
      }
    }
  };

  /**
   * - Remove the µProgress from the DOM.
   * - Remove the `resize` event listener if this is the only non-destroyed instance.
   *
   * @method destroy
   * @memberof UProgress
   * @instance
   */


  UProgress.prototype.destroy = function destroy() {
    if (!this._destroyed) {
      if (this._wrapper.parentNode === this._parent) {
        this._parent.removeChild(this._wrapper);
      }
      delete allUProgress[this._key];
      if (Object.keys(allUProgress).length === 0) {
        window.removeEventListener('resize', _onResize);
        _onResize.cancel();
      }
      this._started = false;
      this._destroyed = true;
    }
  };

  /*
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   */

  /**
   * Update the µProgress instance configuration.
   *
   * @method _options
   * @private
   * @memberof UProgress
   * @instance
   * @param {Object} opts New options to set.
   * @param {Object} [base=this._opts] Options to use when not defined in `opts`.
   */


  UProgress.prototype._options = function _options(opts) {
    var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._opts;

    this._opts = _extends({}, base, opts);
    this._opts.start = clamp_1(this._opts.start, 0, 0.99);
    this._opts.end = clamp_1(this._opts.end, this._opts.start, 1);
    this._opts.doneDuration = Math.max(this._opts.doneDuration, 0);
    this._opts.fadeDuration = Math.max(this._opts.fadeDuration, 0);
    if (opts && opts.class) {
      this._wrapper.className = '' + this._opts.class + (this._rtl ? ' rtl' : '');
    }
    if (opts && opts.blurClass) {
      this._blur.className = this._opts.blurClass;
    }
    if (opts && opts.barClass) {
      this._progressbar.className = this._opts.barClass;
    }
  };

  /**
   * Change the µProgress `target` and the speed at which it reaches it.
   *
   * @method _set
   * @private
   * @memberof UProgress
   * @instance
   * @param {number} [duration=null] The duration in ms the µProgress will take to reach its `target`.
   * @param {number} [target=this._to] The position in percentage (.35 is 35%, 1 is 100%) the µProgress will moving toward.
   * @return {boolean} `true` if the µProgress `duration` or `target` has been changed, `false` otherwise.
   */


  UProgress.prototype._set = function _set() {
    var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._to;

    if (duration !== null && !this._destroyed) {
      if (target === this._to) {
        // Stop the transition by setting the target position to the current one
        style(this._progressbar, 'transform', 'translateX(' + this._progressbar.getBoundingClientRect().left + 'px)');
        reflow(this._progressbar);
      }
      this._duration = Math.max(duration, 0);
      this._to = target;
      this._end = Date.now() + this._duration;
      this._from = this._status().progress;
      styles(this._progressbar, {
        transition: this._duration > 0 ? getVendorCSSProp('transform') + ' ' + this._duration + 'ms linear' : 'none',
        transform: 'translateX(' + this._targetToPosition(this._to) + 'px)'
      });
      reflow(this._progressbar);
      return true;
    }
    return false;
  };

  /**
   * Get the {@link UProgress~Status} of the µProgress.
   *
   * @method _status
   * @private
   * @memberof UProgress
   * @instance
   * @return {Status} The current {@link UProgress~Status}.
   */


  UProgress.prototype._status = function _status() {
    if (!this._started) {
      return { target: this._opts.end };
    }
    var duration = Math.max(0, this._end - Date.now());

    return {
      target: this._to,
      duration: duration,
      progress: this._from + (this._to - this._from) * (1 - (this._duration <= 0 ? 0 : duration / this._duration))
    };
  };

  /**
   * Gracefully complete the µProgress by moving quickly to 100% progress and then fading out.
   *
   * @method _done
   * @private
   * @memberof UProgress
   * @instance
   * @param  {boolean} destroy `true` to automatically call {@link UProgress#destroy} once the µProgress has completed.
   * @param {number} doneDuration The duration in ms that the µProgress take to complete.
   * @param {number} fadeDuration The duration in ms the µProgress takes to fade out after it has completed.
   * @return {boolen} `true` if the µProgress is going to be completed, `false` otherwise.
   */


  UProgress.prototype._done = function _done(destroy, doneDuration, fadeDuration) {
    var _this = this;

    if (this._started && !this._destroyed && !this._completing) {
      this._completing = true;
      transition(this._progressbar, function () {
        _this._set(doneDuration, 1);
      }, function () {
        return transition(_this._progressbar, function () {
          _this._started = false;
          styles(_this._progressbar, {
            transition: fadeDuration > 0 ? 'opacity ' + fadeDuration + 'ms linear' : 'none',
            opacity: 0
          });
          reflow(_this._progressbar);
        }, function () {
          if (destroy) {
            _this.destroy();
          } else {
            style(_this._progressbar, 'visibility', 'hidden');
            _this._to = null;
          }
          _this._completing = false;
        }, fadeDuration <= 0, 'opacity');
      }, doneDuration <= 0, 'transform');
    } else if (destroy) {
      this.destroy();
      return this._started;
    } else {
      return false;
    }
    return true;
  };

  /**
   * Convert a target (in percentage) to a pixel position.
   *
   * @method _targetToPosition
   * @private
   * @param {number} target The target to convert (number between 0 and 1).
   * @return {number} The position in pixel corresponding to the given target.
   */


  UProgress.prototype._targetToPosition = function _targetToPosition(target) {
    return this._width * (1 - target) * (this._rtl ? 1 : -1);
  };

  return UProgress;
}();

/**
  * The default options for all new µProgress instances.
  *
  * @name Default
  * @memberof UProgress
  * @static
  * @constant
  * @default
  * @readonly
  * @type {Object}
  * @property {boolean} [rtl=false] `true` to move the µProgress from right to left, `false` for left to right.
  * @property {number} [start=0.01] The position in percentage (.35 is 35%, 1 is 100%) at which the µProgress starts.
  * @property {number} [end=0.99] The position in percentage (.35 is 35%, 1 is 100%) the µProgress is moving toward when started. Once reached, it will stop until {@link UProgress#set} or {@link UProgress#done} are called.
  * @property {number} [duration=2500] The durarion in ms it takes for the µProgress to go from `start` to `end`.
  * @property {number} [doneDuration=100] The duration in ms that the µProgress take to complete when {@link UProgress#done} is called.
  * @property {number} [fadeDuration=200] The duration in ms the µProgress takes to fade out after it has completed.
  * @property {number} [class='uprogress'] The CSS class to set on the the µProgress element.
  * @property {number} [blurClass='blur'] The CSS class to set on the the µProgress blur element.
  * @property {number} [barClass='bar'] The CSS class to set on the the µProgress bar element.
  * @property {number} [resizeDebounce=300] the debounce threshold after which a window `resize` event trigger a call to {@link UProgress#refresh}.
  *
  * @example
  * Change default options
  * ```javascript
  * UProgress.Default.duration = 3000;
  * UProgress.Default.class = 'custom-uprogress';
  * ```
  */


Object.defineProperty(UProgressAPI, 'Default', {
  get: function get$$1() {
    return DEFAULT;
  }
});

/**
 * Wrap an instance of {@link UProgress} in a closure to exposed only public methods, and hide private attributes.
 *
 * @method UProgressAPI
 * @private
 * @param {...Any} args arguments passed to {@link UProgress#constrcutor}.
 * @constructor
 */
function UProgressAPI() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var uProgress = new (Function.prototype.bind.apply(UProgress, [null].concat(args)))();
  var self = {};

  for (var i = 0, PUBLIC_METHODS = ['start', 'done', 'set', 'status', 'refresh', 'destroy'], length = PUBLIC_METHODS.length; i < length; i++) {
    self[PUBLIC_METHODS[i]] = uProgress[PUBLIC_METHODS[i]].bind(uProgress);
  }
  self.options = function () {
    uProgress.options.apply(uProgress, arguments);
    return self;
  };
  return Object.freeze(self);
}

return UProgressAPI;

})));
//# sourceMappingURL=uprogress.js.map
