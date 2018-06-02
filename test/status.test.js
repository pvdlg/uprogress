/* eslint-env jasmine, jquery, browser */
/* global UProgress */

import {getVendorCSSProp, TRANSITION_END_EVENT} from '../src/js/util';
import {getCSSPosition, getExpectedCSSPosition, getExpectedCSSTransitionDuration} from './helpers/util';

describe('Getting the status of the progressbar', () => {
	let originalDefault;

	beforeAll(() => {
		originalDefault = Object.assign({}, UProgress.Default);
	});

	beforeEach(() => {
		jasmine.clock().install();
		jasmine.clock().mockDate();
	});

	afterEach(() => {
		Object.assign(UProgress.Default, originalDefault);
		jasmine.clock().uninstall();
	});

	it('shoud return an object with target property set to default end target when not started', () => {
		const up = new UProgress();

		expect(up.status()).toEqual({target: UProgress.Default.end});
		up.destroy();
	});

	it('shoud return false when not destroyed', () => {
		const up = new UProgress();

		up.destroy();
		expect(up.status()).toBeFalsy();
	});

	it('shoud should return consistent progress, duration and target', () => {
		const progressRatio1 = 0.3;
		const progressRatio2 = 0.4;

		UProgress.Default.start = 0.1;
		UProgress.Default.end = 0.9;
		UProgress.Default.duration = 500;
		const up = new UProgress();

		up.start();
		jasmine.clock().tick(UProgress.Default.duration * progressRatio1);
		const status = up.status();

		expect(status.duration).toBeCloseTo(UProgress.Default.duration - UProgress.Default.duration * progressRatio1);
		expect(status.progress).toBeCloseTo(
			UProgress.Default.start + (UProgress.Default.end - UProgress.Default.start) * progressRatio1
		);
		expect(status.target).toBe(UProgress.Default.end);

		jasmine.clock().tick(UProgress.Default.duration * progressRatio2);
		const status2 = up.status();

		expect(status2.duration).toBeCloseTo(status.duration - UProgress.Default.duration * progressRatio2);
		expect(status2.progress).toBeCloseTo(
			status.progress + (UProgress.Default.end - UProgress.Default.start) * progressRatio2
		);
		expect(status2.progress).toBeCloseTo(
			UProgress.Default.start + (UProgress.Default.end - UProgress.Default.start) * (progressRatio1 + progressRatio2)
		);
		expect(status2.target).toBe(UProgress.Default.end);
		up.destroy();
	});

	it('shoud return a progress no greater than end', () => {
		const up = new UProgress();

		up.start();
		jasmine.clock().tick(UProgress.Default.duration);
		const status = up.status();

		expect(status.duration).toBe(0);
		expect(status.progress).toBe(UProgress.Default.end);
		expect(status.target).toBe(UProgress.Default.end);
		jasmine.clock().tick(UProgress.Default.duration);
		const status2 = up.status();

		expect(status2.duration).toBe(0);
		expect(status2.progress).toBe(UProgress.Default.end);
		expect(status2.target).toBe(UProgress.Default.end);
		up.destroy();
	});

	it('shoud return consistent progress, duration and target if call set', () => {
		const duration = 300;
		const target = 0.8;
		const duration1 = 200;

		UProgress.Default.start = 0.1;
		UProgress.Default.end = 0.9;
		const up = new UProgress();

		up.start();
		up.set(duration, target);
		jasmine.clock().tick(duration1);
		const status = up.status();

		expect(status.duration).toBe(duration - duration1);
		expect(status.progress).toBeCloseTo(
			UProgress.Default.start + ((target - UProgress.Default.start) * duration1) / duration
		);
		expect(status.target).toBe(target);
		jasmine.clock().tick(duration - duration1);
		const status2 = up.status();

		expect(status2.duration).toBe(0);
		expect(status2.progress).toBeCloseTo(target);
		expect(status2.target).toBe(target);

		jasmine.clock().tick(duration);
		const status3 = up.status();

		expect(status3.duration).toBe(0);
		expect(status3.progress).toBeCloseTo(target);
		expect(status3.target).toBe(target);

		up.destroy();
	});

	it('shoud should return consistent progress duration and target if call set with 0 duration', () => {
		const progress = 0.6;

		UProgress.Default.start = 0.1;
		UProgress.Default.end = 0.9;
		const up = new UProgress();

		up.start();
		up.set(0, progress);
		const status = up.status();

		expect(status.duration).toBe(0);
		expect(status.progress).toBe(progress);
		expect(status.target).toBe(progress);
		up.destroy();
	});

	it('shoud return value after done is called, and an object with target property set to default end target after fading is done', done => {
		const progressDuration = 5;
		const options = {
			doneDuration: 10,
			fadeDuration: 15,
		};
		const up = new UProgress();

		up.options(options);
		expect(up.start()).toBeTruthy();
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect(up.done(false)).toBeTruthy();
		jasmine.clock().tick(progressDuration);
		const status = up.status();

		expect(status.duration).toBeCloseTo(options.doneDuration - progressDuration);
		expect(status.progress).toBeCloseTo(
			UProgress.Default.start +
				((UProgress.Default.end - UProgress.Default.start) * progressDuration) / options.doneDuration
		);

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
				expect(up.status()).toEqual({target: UProgress.Default.end});
				$uProgressBar.one(TRANSITION_END_EVENT, opacityEvent => {
					if (opacityEvent.originalEvent.propertyName === getVendorCSSProp('opacity')) {
						// The progress has finish to fade
						// Test that the progress is not visible
						expect($uProgressBar[0].style.visibility).toBe('hidden');
						expect(up.status()).toEqual({target: UProgress.Default.end});
						up.destroy();
						done();
					}
				});
			}
		});
	});
});
