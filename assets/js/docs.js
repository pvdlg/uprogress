(function (document,window$1) {
'use strict';

document = document && document.hasOwnProperty('default') ? document['default'] : document;
window$1 = window$1 && window$1.hasOwnProperty('default') ? window$1['default'] : window$1;

/**
 * ready : ready(fn)
 * Executes `fn` when the DOM is ready. If the DOM is already ready, the given
 * callback will be called immediately.
 *
 *     var ready = require('dom101/ready');
 *
 *     ready(function () {
 *       ...
 *     });
 */

function ready(fn) {
  if (document.readyState === 'complete') {
    return fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'interactive') fn();
    });
  }
}

var ready_1 = ready;

/**
 * on : on(el, event, fn)
 * Adds an event handler.
 *
 *     var on = require('dom101/on');
 *
 *     on(el, 'click', function () {
 *       ...
 *     });
 */

function on(el, event, handler) {
  if (el.addEventListener) {
    el.addEventListener(event, handler);
  } else {
    el.attachEvent('on' + event, function () {
      handler.call(el);
    });
  }
}

var on_1 = on;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    } else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    } else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window$1.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

var select_1 = select;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





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

var clipboardAction = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        if (typeof undefined === "function" && undefined.amd) {
            undefined(['module', 'select'], factory);
        } else {
            factory(module, select_1);
        }
    })(commonjsGlobal, function (module, _select) {
        'use strict';

        var _select2 = _interopRequireDefault(_select);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }

        var _typeof$$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
            return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        } : function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        };

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var ClipboardAction = function () {
            /**
             * @param {Object} options
             */
            function ClipboardAction(options) {
                _classCallCheck(this, ClipboardAction);

                this.resolveOptions(options);
                this.initSelection();
            }

            /**
             * Defines base properties passed from constructor.
             * @param {Object} options
             */

            _createClass(ClipboardAction, [{
                key: 'resolveOptions',
                value: function resolveOptions() {
                    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                    this.action = options.action;
                    this.container = options.container;
                    this.emitter = options.emitter;
                    this.target = options.target;
                    this.text = options.text;
                    this.trigger = options.trigger;

                    this.selectedText = '';
                }
            }, {
                key: 'initSelection',
                value: function initSelection() {
                    if (this.text) {
                        this.selectFake();
                    } else if (this.target) {
                        this.selectTarget();
                    }
                }
            }, {
                key: 'selectFake',
                value: function selectFake() {
                    var _this = this;

                    var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                    this.removeFake();

                    this.fakeHandlerCallback = function () {
                        return _this.removeFake();
                    };
                    this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                    this.fakeElem = document.createElement('textarea');
                    // Prevent zooming on iOS
                    this.fakeElem.style.fontSize = '12pt';
                    // Reset box model
                    this.fakeElem.style.border = '0';
                    this.fakeElem.style.padding = '0';
                    this.fakeElem.style.margin = '0';
                    // Move element out of screen horizontally
                    this.fakeElem.style.position = 'absolute';
                    this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                    // Move element to the same position vertically
                    var yPosition = window$1.pageYOffset || document.documentElement.scrollTop;
                    this.fakeElem.style.top = yPosition + 'px';

                    this.fakeElem.setAttribute('readonly', '');
                    this.fakeElem.value = this.text;

                    this.container.appendChild(this.fakeElem);

                    this.selectedText = (0, _select2.default)(this.fakeElem);
                    this.copyText();
                }
            }, {
                key: 'removeFake',
                value: function removeFake() {
                    if (this.fakeHandler) {
                        this.container.removeEventListener('click', this.fakeHandlerCallback);
                        this.fakeHandler = null;
                        this.fakeHandlerCallback = null;
                    }

                    if (this.fakeElem) {
                        this.container.removeChild(this.fakeElem);
                        this.fakeElem = null;
                    }
                }
            }, {
                key: 'selectTarget',
                value: function selectTarget() {
                    this.selectedText = (0, _select2.default)(this.target);
                    this.copyText();
                }
            }, {
                key: 'copyText',
                value: function copyText() {
                    var succeeded = void 0;

                    try {
                        succeeded = document.execCommand(this.action);
                    } catch (err) {
                        succeeded = false;
                    }

                    this.handleResult(succeeded);
                }
            }, {
                key: 'handleResult',
                value: function handleResult(succeeded) {
                    this.emitter.emit(succeeded ? 'success' : 'error', {
                        action: this.action,
                        text: this.selectedText,
                        trigger: this.trigger,
                        clearSelection: this.clearSelection.bind(this)
                    });
                }
            }, {
                key: 'clearSelection',
                value: function clearSelection() {
                    if (this.trigger) {
                        this.trigger.focus();
                    }

                    window$1.getSelection().removeAllRanges();
                }
            }, {
                key: 'destroy',
                value: function destroy() {
                    this.removeFake();
                }
            }, {
                key: 'action',
                set: function set$$1() {
                    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                    this._action = action;

                    if (this._action !== 'copy' && this._action !== 'cut') {
                        throw new Error('Invalid "action" value, use either "copy" or "cut"');
                    }
                },
                get: function get$$1() {
                    return this._action;
                }
            }, {
                key: 'target',
                set: function set$$1(target) {
                    if (target !== undefined) {
                        if (target && (typeof target === 'undefined' ? 'undefined' : _typeof$$1(target)) === 'object' && target.nodeType === 1) {
                            if (this.action === 'copy' && target.hasAttribute('disabled')) {
                                throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                            }

                            if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                                throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                            }

                            this._target = target;
                        } else {
                            throw new Error('Invalid "target" value, use a valid Element');
                        }
                    }
                },
                get: function get$$1() {
                    return this._target;
                }
            }]);

            return ClipboardAction;
        }();

        module.exports = ClipboardAction;
    });
});

unwrapExports(clipboardAction);

function E() {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function on(name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function once(name, callback, ctx) {
    var self = this;
    function listener() {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }

    listener._ = callback;
    return this.on(name, listener, ctx);
  },

  emit: function emit(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function off(name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    liveEvents.length ? e[name] = liveEvents : delete e[name];

    return this;
  }
};

var tinyEmitter = E;

var is = createCommonjsModule(function (module, exports) {
  /**
   * Check if argument is a HTML element.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.node = function (value) {
    return value !== undefined && value instanceof HTMLElement && value.nodeType === 1;
  };

  /**
   * Check if argument is a list of HTML elements.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.nodeList = function (value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined && (type === '[object NodeList]' || type === '[object HTMLCollection]') && 'length' in value && (value.length === 0 || exports.node(value[0]));
  };

  /**
   * Check if argument is a string.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.string = function (value) {
    return typeof value === 'string' || value instanceof String;
  };

  /**
   * Check if argument is a function.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.fn = function (value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
  };
});

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest(element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' && element.matches(selector)) {
            return element;
        }
        element = element.parentNode;
    }
}

var closest_1 = closest;

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function destroy() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    };
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function (e) {
        e.delegateTarget = closest_1(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    };
}

var delegate_1 = delegate;

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    } else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    } else if (is.string(target)) {
        return listenSelector(target, type, callback);
    } else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function destroy() {
            node.removeEventListener(type, callback);
        }
    };
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function (node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function destroy() {
            Array.prototype.forEach.call(nodeList, function (node) {
                node.removeEventListener(type, callback);
            });
        }
    };
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate_1(document.body, selector, type, callback);
}

var listen_1 = listen;

var clipboard = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        if (typeof undefined === "function" && undefined.amd) {
            undefined(['module', './clipboard-action', 'tiny-emitter', 'good-listener'], factory);
        } else {
            factory(module, clipboardAction, tinyEmitter, listen_1);
        }
    })(commonjsGlobal, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
        'use strict';

        var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

        var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

        var _goodListener2 = _interopRequireDefault(_goodListener);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }

        var _typeof$$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
            return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        } : function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        };

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }

            return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }

            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var Clipboard = function (_Emitter) {
            _inherits(Clipboard, _Emitter);

            /**
             * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
             * @param {Object} options
             */
            function Clipboard(trigger, options) {
                _classCallCheck(this, Clipboard);

                var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

                _this.resolveOptions(options);
                _this.listenClick(trigger);
                return _this;
            }

            /**
             * Defines if attributes would be resolved using internal setter functions
             * or custom functions that were passed in the constructor.
             * @param {Object} options
             */

            _createClass(Clipboard, [{
                key: 'resolveOptions',
                value: function resolveOptions() {
                    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                    this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                    this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                    this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                    this.container = _typeof$$1(options.container) === 'object' ? options.container : document.body;
                }
            }, {
                key: 'listenClick',
                value: function listenClick(trigger) {
                    var _this2 = this;

                    this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                        return _this2.onClick(e);
                    });
                }
            }, {
                key: 'onClick',
                value: function onClick(e) {
                    var trigger = e.delegateTarget || e.currentTarget;

                    if (this.clipboardAction) {
                        this.clipboardAction = null;
                    }

                    this.clipboardAction = new _clipboardAction2.default({
                        action: this.action(trigger),
                        target: this.target(trigger),
                        text: this.text(trigger),
                        container: this.container,
                        trigger: trigger,
                        emitter: this
                    });
                }
            }, {
                key: 'defaultAction',
                value: function defaultAction(trigger) {
                    return getAttributeValue('action', trigger);
                }
            }, {
                key: 'defaultTarget',
                value: function defaultTarget(trigger) {
                    var selector = getAttributeValue('target', trigger);

                    if (selector) {
                        return document.querySelector(selector);
                    }
                }
            }, {
                key: 'defaultText',
                value: function defaultText(trigger) {
                    return getAttributeValue('text', trigger);
                }
            }, {
                key: 'destroy',
                value: function destroy() {
                    this.listener.destroy();

                    if (this.clipboardAction) {
                        this.clipboardAction.destroy();
                        this.clipboardAction = null;
                    }
                }
            }], [{
                key: 'isSupported',
                value: function isSupported() {
                    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                    var actions = typeof action === 'string' ? [action] : action;
                    var support = !!document.queryCommandSupported;

                    actions.forEach(function (action) {
                        support = support && !!document.queryCommandSupported(action);
                    });

                    return support;
                }
            }]);

            return Clipboard;
        }(_tinyEmitter2.default);

        /**
         * Helper function to retrieve attribute value.
         * @param {String} suffix
         * @param {Element} element
         */
        function getAttributeValue(suffix, element) {
            var attribute = 'data-clipboard-' + suffix;

            if (!element.hasAttribute(attribute)) {
                return;
            }

            return element.getAttribute(attribute);
        }

        module.exports = Clipboard;
    });
});

var Clipboard = unwrapExports(clipboard);

/**
 * querySelectorAll : querySelectorAll(query, [element])
 * Convenience function to access `document.querySelectorAll`. Unlike the
 * default version, this always returns an array.
 *
 * If a 2nd parameter `element` is given, it only searches for descendants of
 * that element.
 *
 *     var each = require('dom101/each');
 *     var qsa = require('dom101/query-selector-all');
 *
 *     qsa('.button').each(el => {
 *       addClass('el', 'selected');
 *     };
 */

function querySelectorAll(query, context) {
  return Array.prototype.slice.call((context || document).querySelectorAll(query));
}

var querySelectorAll_1 = querySelectorAll;

/**
 * each : each(list, fn)
 * Iterates through `list` (an array or an object). This is useful when dealing
 * with NodeLists like `document.querySelectorAll`.
 *
 *     var each = require('dom101/each');
 *     var qa = require('dom101/query-selector-all');
 *
 *     each(qa('.button'), function (el) {
 *       addClass('el', 'selected');
 *     });
 */

function each(list, fn) {
  var i;
  var len = list.length;
  var idx;

  if (typeof len === 'number') {
    for (i = 0; i < len; i++) {
      fn(list[i], i);
    }
  } else {
    idx = 0;
    for (i in list) {
      if (list.hasOwnProperty(i)) {
        fn(list[i], i, idx++);
      }
    }
  }

  return list;
}

var each_1 = each;

// Import addClass from 'dom101/add-class';

ready_1(function () {
  each_1(querySelectorAll_1('.example ~ .highlight'), function (hl) {
    var copy = '<button class="copy">Copy</button>';

    hl.insertAdjacentHTML('beforeend', copy);
  });

  var clipboard$$1 = new Clipboard('.copy', {
    target: function target(trigger) {
      return trigger.previousSibling;
    }
  });

  clipboard$$1.on('success', function (el) {
    showTooltip(el.trigger, 'Copied!');
    el.clearSelection();
  });

  var btns = document.querySelectorAll('.copy');

  for (var i = 0, length = btns.length; i < length; i++) {
    on_1(btns[i], 'mouseleave', clearTooltip);
    on_1(btns[i], 'blur', clearTooltip);
  }
});

function clearTooltip(el) {
  el.currentTarget.setAttribute('class', 'copy');
  el.currentTarget.removeAttribute('aria-label');
}

function showTooltip(elem, msg) {
  elem.setAttribute('class', 'copy tooltipped tooltipped-n');
  elem.setAttribute('aria-label', msg);
}

/* eslint-disable no-magic-numbers, require-jsdoc */

function start(idx, uProgresses, startBtns, doneBtns) {
  for (var i = 0, length = uProgresses.length; i < length; i++) {
    uProgresses[i].done();
    startBtns[i].disabled = false;
    doneBtns[i].disabled = true;
  }

  startBtns[idx].disabled = true;
  doneBtns[idx].disabled = false;
  uProgresses[idx].start();
}

function done(idx, uProgresses, startBtns, doneBtns) {
  startBtns[idx].disabled = false;
  doneBtns[idx].disabled = true;
  uProgresses[idx].done();
}

ready_1(function () {
  var uProgress1 = new UProgress();
  var uProgress2 = new UProgress({ class: 'uprogress-purple' });
  var uProgress3 = new UProgress({ rtl: true });
  var uProgress4 = new UProgress(document.getElementById('container-expl'));
  var expl1StartBtn = document.getElementById('expl1-start');
  var expl1DoneBtn = document.getElementById('expl1-done');
  var expl2StartBtn = document.getElementById('expl2-start');
  var expl2DoneBtn = document.getElementById('expl2-done');
  var expl2PurpleBtn = document.getElementById('expl2-purple');
  var expl2LargeBtn = document.getElementById('expl2-lg');
  var expl2BottomBtn = document.getElementById('expl2-bottom');
  var expl2MultiBtn = document.getElementById('expl2-multi');
  var expl3StartBtn = document.getElementById('expl3-start');
  var expl3DoneBtn = document.getElementById('expl3-done');
  var expl4StartBtn = document.getElementById('expl4-start');
  var expl4DoneBtn = document.getElementById('expl4-done');
  var uProgresses = [uProgress1, uProgress2, uProgress3, uProgress4];
  var startBtns = [expl1StartBtn, expl2StartBtn, expl3StartBtn, expl4StartBtn];
  var doneBtns = [expl1DoneBtn, expl2DoneBtn, expl3DoneBtn, expl4DoneBtn];

  if (expl1StartBtn && expl1DoneBtn) {
    expl1DoneBtn.disabled = true;

    on_1(expl1StartBtn, 'click', function () {
      start(0, uProgresses, startBtns, doneBtns);
    });

    on_1(expl1DoneBtn, 'click', function () {
      done(0, uProgresses, startBtns, doneBtns);
    });
  }

  if (expl2StartBtn && expl2DoneBtn) {
    expl2DoneBtn.disabled = true;

    on_1(expl2StartBtn, 'click', function () {
      start(1, uProgresses, startBtns, doneBtns);
    });

    on_1(expl2PurpleBtn, 'click', function () {
      uProgress2.options({ class: 'uprogress-purple' });
    });

    on_1(expl2LargeBtn, 'click', function () {
      uProgress2.options({ class: 'uprogress-lg' });
    });

    on_1(expl2BottomBtn, 'click', function () {
      uProgress2.options({ class: 'uprogress-bottom' });
    });

    on_1(expl2MultiBtn, 'click', function () {
      uProgress2.options({ class: 'uprogress-multi' });
    });

    on_1(expl2DoneBtn, 'click', function () {
      done(1, uProgresses, startBtns, doneBtns);
    });
  }

  if (expl3StartBtn && expl3DoneBtn) {
    expl3DoneBtn.disabled = true;

    on_1(expl3StartBtn, 'click', function () {
      start(2, uProgresses, startBtns, doneBtns);
    });

    on_1(expl3DoneBtn, 'click', function () {
      done(2, uProgresses, startBtns, doneBtns);
    });
  }

  if (expl4StartBtn && expl4DoneBtn) {
    expl4DoneBtn.disabled = true;

    on_1(expl4StartBtn, 'click', function () {
      start(3, uProgresses, startBtns, doneBtns);
    });

    on_1(expl4DoneBtn, 'click', function () {
      done(3, uProgresses, startBtns, doneBtns);
    });
  }
});

var browserPrefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
var uProgressClases = ['uprogress', 'uprogress-bottom-orange', 'uprogress-multi', 'uprogress-purple', 'uprogress-red', 'uprogress-green'];

ready_1(function () {
  var sidebar = document.getElementById('sidebar');

  if (sidebar) {
    for (var i = 0; i < browserPrefix.length; i += 1) {
      sidebar.style.position = browserPrefix[i] + 'sticky';
    }

    if (sidebar.style.position !== '') {
      sidebar.classList.add('is-sticky');
    }
  }
});

ready_1(function () {
  var indexStartBtn = document.getElementById('index-start');
  var indexDoneBtn = document.getElementById('index-done');
  var indexChangeColorBtn = document.getElementById('index-change-color');
  var currentClass = 0;

  if (indexStartBtn && indexDoneBtn) {
    var uProgress = void 0;

    indexDoneBtn.disabled = true;
    indexChangeColorBtn.disabled = true;

    on_1(indexStartBtn, 'click', function () {
      if (!uProgress) {
        uProgress = new UProgress();
      }

      indexStartBtn.disabled = true;
      indexDoneBtn.disabled = false;
      indexChangeColorBtn.disabled = false;
      uProgress.start();
    });

    on_1(indexChangeColorBtn, 'click', function () {
      if (uProgress) {
        currentClass += 1;
        currentClass = currentClass >= uProgressClases.length ? currentClass - uProgressClases.length : currentClass;
        console.log(currentClass);
        uProgress.options({ class: uProgressClases[currentClass] });
      }
    });

    on_1(indexDoneBtn, 'click', function () {
      if (uProgress) {
        indexStartBtn.disabled = false;
        indexDoneBtn.disabled = true;
        indexChangeColorBtn.disabled = true;
        uProgress.done();
      }
    });
  }
});

}(document,window));
//# sourceMappingURL=docs.js.map
