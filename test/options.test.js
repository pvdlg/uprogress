/* eslint-env jasmine, jquery, browser */
/* global UProgress */

import {getVendorCSSProp, TRANSITION_END_EVENT} from '../src/js/util';
import {getCSSPosition, getExpectedCSSPosition, getExpectedCSSTransitionDuration} from './helpers/util';

describe('Changing options', () => {
	let originalDefault;

	beforeAll(() => {
		originalDefault = Object.assign({}, UProgress.Default);
		UProgress.Default.start = 0.1;
		UProgress.Default.end = 0.9;
		UProgress.Default.duration = 23;
		UProgress.Default.doneDuration = 11;
		UProgress.Default.fadeDuration = 14;
	});

	afterEach(() => {
		Object.assign(UProgress.Default, originalDefault);
	});

	it('shoud return the API object (chainable)', () => {
		const up = new UProgress();
		const upOptions = up.options({});

		expect(up).toBeTruthy(upOptions);
		expect(Object.isFrozen(upOptions)).toBeTruthy();
		up.destroy();
	});

	it('shoud affect end, duration and rtl for instances not yet started', () => {
		const options = {
			rtl: true,
			end: 0.8,
			duration: 800,
		};
		const up = new UProgress();

		up.options(options);
		const result = up.start();
		const $uProgress = $('body > div.uprogress');
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect($uProgress).toHaveClass('rtl');
		expect(result).toBeTruthy();
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(options.duration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(
			getExpectedCSSPosition($uProgressBar, options.end, options.rtl),
			0
		);
		up.destroy();
	});

	it('shoud not affect end, duration and rtl for started instances', () => {
		const options = {
			rtl: true,
			end: 0.8,
			duration: 800,
		};
		const up = new UProgress();
		const result = up.start();
		const $uProgress = $('body > div.uprogress');
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(result).toBeTruthy();
		up.options(options);
		expect($uProgress).not.toHaveClass('rtl');
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.duration))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(
			getExpectedCSSPosition($uProgressBar, UProgress.Default.end, false),
			0
		);
		up.destroy();
	});

	it('shoud affect start for following set calls', () => {
		const options = {start: 0.2};
		const up = new UProgress();
		const result = up.start();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(result).toBeTruthy();
		up.options(options);
		up.set(0, 0, true);
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, options.start), 0);
		up.destroy();
	});

	it('shoud not affect start if set was already called', () => {
		const options = {start: 0.2};
		const up = new UProgress();
		const result = up.start();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(result).toBeTruthy();
		up.set(0, 0, true);
		up.options(options);
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(
			getExpectedCSSPosition($uProgressBar, UProgress.Default.start),
			0
		);
		up.destroy();
	});

	it('shoud not remove rtl class when started', () => {
		const options = {rtl: true};
		const up = new UProgress(options);

		expect(up.start()).toBeTruthy();
		const $uProgress = $('body > div.uprogress');

		expect($uProgress).toHaveClass('rtl');
		up.options({rtl: false});
		expect($uProgress).toHaveClass('rtl');
		up.destroy();
	});

	it('shoud affect rtl for following start calls', done => {
		const options = {rtl: true, start: 0.2};
		const up = new UProgress();
		const result = up.start();
		const $uProgress = $('body > div.uprogress');
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect($uProgress).not.toHaveClass('rtl');
		expect(result).toBeTruthy();
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(
			getExpectedCSSPosition($uProgressBar, UProgress.Default.end, false),
			0
		);
		up.options(options);
		expect($uProgress).not.toHaveClass('rtl');
		expect(up.done()).toBeTruthy();
		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						expect(up.start()).toBeTruthy();
						expect($uProgress).toHaveClass('rtl');
						expect(getCSSPosition($uProgressBar)).toBeCloseTo(
							getExpectedCSSPosition($uProgressBar, UProgress.Default.end, options.rtl),
							0
						);
						up.destroy();
						done();
					}
				});
			}
		});
	});

	it('shoud affect doneDuration and fadeDuration for started instances on which done is not yet called', done => {
		const options = {
			doneDuration: 15,
			fadeDuration: 11,
		};
		const up = new UProgress();
		const result = up.start();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(result).toBeTruthy();
		up.options(options);

		expect(up.done()).toBeTruthy();
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(options.doneDuration))
		);

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				expect(transformEvent.originalEvent.elapsedTime).toBeCloseTo(options.doneDuration / 1000);
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(options.fadeDuration))
				);
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

	it('shoud not affect doneDuration and fadeDuration after done has been called', done => {
		const options = {
			doneDuration: 12,
			fadeDuration: 14,
		};
		const up = new UProgress();
		const result = up.start();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(result).toBeTruthy();
		expect(up.done()).toBeTruthy();
		up.options(options);
		// Test that the progress bar is moving toward the end position in doneDuration ms
		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.doneDuration))
		);

		$uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
			if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
				expect(transformEvent.originalEvent.elapsedTime).toBeCloseTo(UProgress.Default.doneDuration / 1000);
				// The progress has finish to move toward position 100%
				// Test that the progress is fading in fadeDuration ms
				expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
					parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.fadeDuration))
				);
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

	it('shoud change the CSS classes for the wrapper, the progress bar and the blur on started instances', () => {
		const options = {
			class: 'uprogress5',
			barClass: 'uprogress5-bar',
			blurClass: 'uprogress5-blur',
		};
		const up = new UProgress();

		up.start();
		expect($(`body > div.${UProgress.Default.class}`)).toExist();
		expect($(`body > div.${UProgress.Default.class} > .${UProgress.Default.barClass}`)).toExist();
		expect(
			$(`body > div.${UProgress.Default.class} > .${UProgress.Default.barClass} > .${UProgress.Default.blurClass}`)
		).toExist();

		up.options(options);
		expect($(`body > div.${options.class}`)).toExist();
		expect($(`body > div.${options.class} > .${options.barClass}`)).toExist();
		expect($(`body > div.${options.class} > .${options.barClass} > .${options.blurClass}`)).toExist();
		up.destroy();
	});

	it('shoud change the CSS classes for the wrapper, the progress bar and the blur on non started instances', () => {
		const options = {
			class: 'uprogress6',
			barClass: 'uprogress6-bar',
			blurClass: 'uprogress6-blur',
		};
		const up = new UProgress();

		up.options(options);
		expect($(`body > div.${options.class}`)).toExist();
		expect($(`body > div.${options.class} > .${options.barClass}`)).toExist();
		expect($(`body > div.${options.class} > .${options.barClass} > .${options.blurClass}`)).toExist();
		up.destroy();
	});
});
