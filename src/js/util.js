/* eslint-env browser */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const CSS_PREFIXES = ['Webkit', 'O', 'Moz', 'ms'];
const PREFIXED_EVENT_NAMES = {
  transition: 'transitionend',
  MozTransition: 'mozTransitionEnd',
  OTransition: 'oTransitionEnd',
  WebkitTransition: 'webkitTransitionEnd',
};
const PREFIXED_PROP_CACHE = {};

export const TRANSITION_END_EVENT = PREFIXED_EVENT_NAMES[getVendorProp('transition')];

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
export function reflow(element) {
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
export function style(element, prop, value) {
  element.style[getVendorProp(prop)] = value;
}

/**
 * Set multiple style properties of an element.
 *
 * @method styles
 * @param {HTMLElement} element the element on which to set the style property.
 * @param {Object<string, Any>} props a hash of CSS properties and values to set.
 */
export function styles(element, props) {
  for (let i = 0, keys = Object.keys(props), {length} = keys; i < length; i++) {
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
    for (let i = 0, {length} = CSS_PREFIXES; i < length; i++) {
      const vendorName = `${CSS_PREFIXES[i]}${name.charAt(0).toUpperCase()}${name.slice(1)}`;

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
export function getVendorCSSProp(name) {
  return getVendorProp(name)
    .replace(/([A-Z])/g, (str, m1) => `-${m1.toLowerCase()}`)
    .replace(/^ms-/, '-ms-');
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
export function transition(element, start, end, immediate, property) {
  if (end) {
    if (immediate) {
      setTimeout(end);
    } else {
      const handler = event => {
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
