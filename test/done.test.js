/* eslint-env jasmine, jquery, browser */
/* global UProgress */

import {getVendorCSSProp, TRANSITION_END_EVENT} from '../src/js/util';
import {getCSSPosition, getExpectedCSSPosition, getExpectedCSSTransitionDuration} from './helpers/util';

describe('Complete the progress bar', () => {
	let originalDefault;

	beforeAll(() => {
		originalDefault = Object.assign({}, UProgress.Default);
		UProgress.Default.duration = 30;
		UProgress.Default.end = 0.9;
		UProgress.Default.doneDuration = 25;
		UProgress.Default.fadeDuration = 15;
	});

	beforeEach(() => {
		jasmine.clock().install();
		jasmine.clock().mockDate();
	});

	afterEach(() => {
		Object.assign(UProgress.Default, originalDefault);
		jasmine.clock().uninstall();
	});

	it('shoud move to 100%, then fade and then become invisible at the speed defined in Default options', done => {
		const up = new UProgress();

		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done()).toBeTruthy();
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.doneDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				expect(transformEvent.originalEvent.elapsedTime).toBeCloseTo(UProgress.Default.doneDuration / 1000);
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.fadeDuration))
				);
				expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('opacity'));
				expect($uProgressBar[0].style.opacity).toBe('0');
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						expect(opacityEvent.originalEvent.elapsedTime).toBeCloseTo(UProgress.Default.fadeDuration / 1000);
						// The progress has finish to fade
						// Test that the progress is not visible
						expect($uProgressBar[0].style.visibility).toBe('hidden');
						up.destroy();
						done();
					}
				});
			}
		});
	});

	it('shoud move to 100%, then fade and then become invisible at the speed defined in Default options with RTL', done => {
		UProgress.Default.rtl = true;
		const up = new UProgress();

		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done()).toBeTruthy();
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.doneDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(
			getExpectedCSSPosition($uProgressBar, 1, UProgress.Default.rtl),
			0
		);

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				expect(transformEvent.originalEvent.elapsedTime).toBeCloseTo(UProgress.Default.doneDuration / 1000);
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.fadeDuration))
				);
				expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('opacity'));
				expect($uProgressBar[0].style.opacity).toBe('0');
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						expect(opacityEvent.originalEvent.elapsedTime).toBeCloseTo(UProgress.Default.fadeDuration / 1000);
						// The progress has finish to fade
						// Test that the progress is not visible
						expect($uProgressBar[0].style.visibility).toBe('hidden');
						up.destroy();
						done();
					}
				});
			}
		});
	});

	it('shoud move to 100%, then fade and then become invisible at the speed defined constructor options', done => {
		const options = {
			doneDuration: 14,
			fadeDuration: 12,
		};
		const up = new UProgress(document.body, options);

		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done()).toBeTruthy();
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(options.doneDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				expect(transformEvent.originalEvent.elapsedTime).toBeCloseTo(options.doneDuration / 1000);
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(options.fadeDuration))
				);
				expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('opacity'));
				expect($uProgressBar[0].style.opacity).toBe('0');
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						expect(opacityEvent.originalEvent.elapsedTime).toBeCloseTo(options.fadeDuration / 1000);
						// The progress has finish to fade
						// Test that the progress is not visible
						expect($uProgressBar[0].style.visibility).toBe('hidden');
						up.destroy();
						done();
					}
				});
			}
		});
	});

	it('shoud move to 100%, then fade and then become invisible at the speed defined constructor options with RTL', done => {
		const options = {
			rtl: true,
			doneDuration: 13,
			fadeDuration: 12,
		};
		const up = new UProgress(document.body, options);

		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done()).toBeTruthy();
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(options.doneDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1, options.rtl), 0);

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				expect(transformEvent.originalEvent.elapsedTime).toBeCloseTo(options.doneDuration / 1000);
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(options.fadeDuration))
				);
				expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('opacity'));
				expect($uProgressBar[0].style.opacity).toBe('0');
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						expect(opacityEvent.originalEvent.elapsedTime).toBeCloseTo(options.fadeDuration / 1000);
						// The progress has finish to fade
						// Test that the progress is not visible
						expect($uProgressBar[0].style.visibility).toBe('hidden');
						up.destroy();
						done();
					}
				});
			}
		});
	});

	it('shoud move to 100%, then fade and then become invisible at the speed defined with options method', done => {
		const options = {
			doneDuration: 15,
			fadeDuration: 13,
		};
		const up = new UProgress();

		up.options(options);
		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done(false)).toBeTruthy();
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(options.doneDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(options.fadeDuration))
				);
				expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('opacity'));
				expect($uProgressBar[0].style.opacity).toBe('0');
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						// The progress has finish to fade
						// Test that the progress is not visible
						expect($uProgressBar[0].style.visibility).toBe('hidden');
						up.destroy();
						done();
					}
				});
			}
		});
	});

	it('shoud move to 100%, then fade and then destroy the progressbar', done => {
		const up = new UProgress();

		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done(true)).toBeTruthy();
		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				// The progress has finish to move toward position 100%
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						// The progress has finish to fade
						// Test that the progressbar has been destroyed
						expect($uProgressBar[0]).not.toBeInDOM();
						done();
					}
				});
			}
		});
	});

	it('shoud move to 100%, then fade and then become invisible with 0 doneDuration and positive fadeDuration', done => {
		const options = {doneDuration: 0};
		const up = new UProgress();

		up.options(options);
		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done(false)).toBeTruthy();
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(0))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('none'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);
		jasmine.clock().tick(0);

		// The progress has finish to move toward position 100%
		// Test that the progress is fading in fadeDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.fadeDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('opacity'));
		expect($uProgressBar[0].style.opacity).toBe('0');
		$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
			if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
				expect(opacityEvent.originalEvent.elapsedTime).toBeCloseTo(UProgress.Default.fadeDuration / 1000);
				// The progress has finish to fade
				// Test that the progress is not visible
				expect($uProgressBar[0].style.visibility).toBe('hidden');
				up.destroy();
				done();
			}
		});
	});

	it('shoud move to 100%, then fade and then become invisible with positive doneDuration and 0 fadeDuration', done => {
		const options = {
			doneDuration: 11,
			fadeDuration: 0,
		};
		const up = new UProgress();

		up.options(options);
		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done(false)).toBeTruthy();
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(options.doneDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(options.fadeDuration))
				);
				expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('none'));
				expect($uProgressBar[0].style.opacity).toBe('0');
				jasmine.clock().tick(0);
				// The progress has finish to fade
				// Test that the progress is not visible
				expect($uProgressBar[0].style.visibility).toBe('hidden');
				up.destroy();
				done();
			}
		});
	});

	it('shoud move to 100%, then fade and then become invisible with 0 duration', () => {
		const options = {
			doneDuration: 0,
			fadeDuration: 0,
		};
		const up = new UProgress();

		up.options(options);
		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done(false)).toBeTruthy();
		jasmine.clock().tick(0);
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(options.doneDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe('none');
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);
		jasmine.clock().tick(0);
		expect($uProgressBar[0].style.opacity).toBe('0');
		expect($uProgressBar[0].style.visibility).toBe('hidden');
		up.destroy();
	});

	it('shoud consider negative done and fade duration as 0', () => {
		const options = {
			doneDuration: -100,
			fadeDuration: -100,
		};
		const up = new UProgress();

		up.options(options);
		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done(false)).toBeTruthy();
		jasmine.clock().tick(0);

		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(0))
		);
		expect($uProgressBar.css('transition-property')).toBe('none');
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);
		jasmine.clock().tick(0);
		expect($uProgressBar[0].style.opacity).toBe('0');
		expect($uProgressBar[0].style.visibility).toBe('hidden');
		up.destroy();
	});

	it('shoud destroy the progress bar when not started', () => {
		const up = new UProgress();
		const $uProgressBar = $('body > div > .bar');

		expect(up.done(true)).toBeFalsy();
		expect($uProgressBar[0]).not.toBeInDOM();
	});

	it('shoud return false when calling done while not started', () => {
		const up = new UProgress();

		expect(up.done()).toBeFalsy();
		up.destroy();
	});

	it('shoud return false when calling done while aleady done', () => {
		const up = new UProgress();

		up.start();
		expect(up.done()).toBeTruthy();
		expect(up.done()).toBeFalsy();
		up.destroy();
	});

	it('shoud destroy when calling done(true) even after calling done()', () => {
		const up = new UProgress();

		up.start();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done()).toBeTruthy();
		expect(up.done(true)).toBeFalsy();
		expect($uProgressBar[0]).not.toBeInDOM();
	});

	it('shoud return false and not throw an error when calling done after destroying', () => {
		const up = new UProgress();

		up.start();
		up.destroy();
		expect(up.done).not.toThrow();
		expect(up.done()).toBeFalsy();
	});

	it('shoud return false and not throw an error when calling done(true) after destroying', () => {
		const up = new UProgress();

		up.start();
		up.destroy();
		expect(() => up.done(true)).not.toThrow();
		expect(up.done(true)).toBeFalsy();
	});

	it('shoud prevent to call set and start (return false) while completing', done => {
		const options = {
			doneDuration: 12,
			fadeDuration: 15,
		};
		const up = new UProgress();

		up.options(options);
		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done(false)).toBeTruthy();
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(options.doneDuration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);
		expect(up.start()).toBeFalsy();
		expect(up.set(1)).toBeFalsy();

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(options.fadeDuration))
				);
				expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('opacity'));
				expect($uProgressBar[0].style.opacity).toBe('0');
				expect(up.start()).toBeFalsy();
				expect(up.set(1)).toBeFalsy();
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						// The progress has finish to fade
						// Test that the progress is not visible
						expect($uProgressBar[0].style.visibility).toBe('hidden');
						expect(up.start()).toBeTruthy();
						up.destroy();
						done();
					}
				});
			}
		});
	});
});
