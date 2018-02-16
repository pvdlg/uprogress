import convert from 'mout/time/convert';
import {getVendorCSSProp} from '../../src/js/util';

const TRANSITIONX_REGEX = /\.*translateX\((.*)px\)/i;

/**
 * Get the current target in pixel for the progress bar position.
 *
 * @param {JQuery} $uProgress JQuery of the progressbar.
 * @return {string} The pixel value of the translateX function in transform property.
 */
export function getCSSPosition($uProgress) {
	return TRANSITIONX_REGEX.exec($uProgress[0].style[getVendorCSSProp('transform')])[1];
}

/**
 * Get the expected position in pixel for a given target (based on the progressbar size).
 *
 * @param {JQuery} $uProgress JQuery of the progressbar.
 * @param {number} target the target (0 <-> 1) for which to retrieve the pixel position.
 * @param {number} rtl `true` if the µProgress is configured to go from right to left.
 * @return {number} the expected value in pixels of the translateX function in transform property for the given target.
 */
export function getExpectedCSSPosition($uProgress, target, rtl) {
	return $uProgress.width() * (1 - target) * (rtl ? 1 : -1);
}

/**
 * Get the string duration expected to be used in the transition css property for a given duration in millisecnds.
 *
 * @param {number} duration duration in milliseconds to convert
 * @return {string} the duration expected to be used in the transition css property
 */
export function getExpectedCSSTransitionDuration(duration) {
	return `${convert(duration, 'ms', 's')}s`;
}
