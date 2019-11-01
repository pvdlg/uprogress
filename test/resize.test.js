/* eslint-env jasmine, jquery, browser */
/* global UProgress, loadFixtures */

import CustomEvent from 'custom-event';
import {getVendorCSSProp} from '../src/js/util';
import {getCSSPosition, getExpectedCSSPosition, getExpectedCSSTransitionDuration} from './helpers/util';

describe('Resizing the window', () => {
	let originalDefault;

	beforeAll(() => {
		$('html').css({
			overflow: '',
			padding: '',
		});
		spyOn(window, 'removeEventListener').and.callThrough();
		spyOn(window, 'addEventListener').and.callThrough();
		originalDefault = Object.assign({}, UProgress.Default);
		UProgress.Default.start = 0;
		UProgress.Default.end = 0.8;
		UProgress.Default.duration = 1000;
	});

	beforeEach(() => {
		jasmine.clock().install();
		jasmine.clock().mockDate();
	});

	afterEach(() => {
		Object.assign(UProgress.Default, originalDefault);
		jasmine.clock().uninstall();
	});

	it("shoud change the width of the progressbar to be equals to the parent's (document.body)", () => {
		const $html = $('html');
		const up = new UProgress();

		up.start();
		const $uProgress = $('body > div.uprogress');
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect($uProgress.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		$html.css('width', `${$html.width() * 0.8}px`);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect($uProgress.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		expect($uProgressBar.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		up.destroy();
		$html.css('width', '');
	});

	it("shoud change the width of the progressbar to be equals to the parent's (div)", () => {
		loadFixtures('parent.html');
		const $parent = $('#parent');
		const $html = $('html');

		$parent.css({
			height: '100px',
			'margin-right': '50px',
			'margin-left': '50px',
		});
		const up = new UProgress($parent[0]);

		up.start();
		const $uProgress = $('#parent > div.uprogress');
		const $uProgressBar = $('#parent > div.uprogress > .bar');

		expect($uProgress.width()).toBe($parent.width());
		$html.css('width', `${$html.width() * 0.8}px`);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect($uProgress.width()).toBe($parent[0].clientWidth);
		expect($uProgressBar.width()).toBe($parent[0].clientWidth);
		up.destroy();
		$html.css('width', '');
	});

	it("shoud change the width of the progressbar to be equals to the parent's (div) with rtl", () => {
		loadFixtures('parent.html');
		const $parent = $('#parent');
		const $html = $('html');

		$parent.css({
			height: '100px',
			'margin-right': '50px',
			'margin-left': '50px',
		});
		const up = new UProgress($parent[0], {rtl: true});

		up.start();
		const $uProgress = $('#parent > div.uprogress');
		const $uProgressBar = $('#parent > div.uprogress > .bar');

		expect($uProgress.width()).toBe($parent.width());
		$html.css('width', `${$html.width() * 0.8}px`);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect($uProgress.width()).toBe($parent[0].clientWidth);
		expect($uProgressBar.width()).toBe($parent[0].clientWidth);
		up.destroy();
		$html.css('width', '');
	});

	it('shoud maintain the status during resize with document.body parent', () => {
		UProgress.Default.resizeDebounce = 0;
		const resizeTimeout = UProgress.Default.duration / 2;
		const $html = $('html');
		const up = new UProgress();

		up.start();
		jasmine.clock().tick(resizeTimeout);
		$html.css('width', `${$html.width() * 0.8}px`);
		const status = up.status();

		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		// Test that the duration to reach the target is set to the duration left from duration
		const newStatus = up.status();

		expect(status.duration).toBe(newStatus.duration);
		expect(status.progress).toBe(newStatus.progress);
		up.destroy();
		$html.css('width', '');
	});

	it("shoud change the width of the progressbar to be equals to the parent's if not started", () => {
		loadFixtures('parent.html');
		const $parent = $('#parent');
		const $html = $('html');

		$parent.css({
			height: '100px',
			'margin-right': '50px',
			'margin-left': '50px',
		});
		const up = new UProgress($parent[0]);
		const $uProgress = $('#parent > div');
		const $uProgressBar = $('#parent > div > .bar');

		expect($uProgress.width()).toBe($parent.width());
		$html.css('width', `${$html.width() * 0.8}px`);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect($uProgress.width()).toBe($parent[0].clientWidth);
		expect($uProgressBar.width()).toBe($parent[0].clientWidth);
		up.destroy();
		$html.css('width', '');
	});

	it('shoud maintain the status during resize with div parent', () => {
		UProgress.Default.resizeDebounce = 0;
		loadFixtures('parent.html');
		const resizeTimeout = UProgress.Default.duration / 2;
		const $parent = $('#parent');
		const $html = $('html');

		$parent.css({
			height: '100px',
			'margin-right': '50px',
			'margin-left': '50px',
		});
		const up = new UProgress($parent[0]);

		up.start();
		jasmine.clock().tick(resizeTimeout);
		$html.css('width', `${$html.width() * 0.8}px`);
		const status = up.status();

		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		// Test that the duration to reach the target is set to the duration left from duration
		const newStatus = up.status();

		expect(status.duration).toBe(newStatus.duration);
		expect(status.progress).toBe(newStatus.progress);
		up.destroy();
		$html.css('width', '');
	});

	it('shoud maintain the current progress (relative to document.body width) and time remaining to reach the target', () => {
		const resizeTimeout = UProgress.Default.duration / 2;
		const $html = $('html');
		const up = new UProgress();

		up.start();
		const $uProgressBar = $('body > div.uprogress > .bar');
		const startTime = Date.now();

		jasmine.clock().tick(resizeTimeout);
		$html.css('width', `${$html.width() * 0.8}px`);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		// Test that the duration to reach the target is set to the duration left from duration
		const elapsedTime = Date.now() - startTime;

		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.duration - elapsedTime))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		// Test that the target is still the same relative to the new width (the position in pixel should have change)
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, UProgress.Default.end), 0);
		up.destroy();
		$html.css('width', '');
	});

	it('shoud maintain the current progress (relative to div width) and time remaining to reach the target', () => {
		loadFixtures('parent.html');
		const resizeTimeout = UProgress.Default.duration / 2;
		const $parent = $('#parent');
		const $html = $('html');

		$parent.css({
			height: '100px',
			'margin-right': '50px',
			'margin-left': '50px',
		});
		const up = new UProgress($parent[0]);

		up.start();
		const $uProgressBar = $('#parent > div.uprogress > .bar');
		const startTime = Date.now();

		jasmine.clock().tick(resizeTimeout);
		$html.css('width', `${$html.width() * 0.8}px`);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		// Test that the duration to reach the target is set to the duration left from duration
		const elapsedTime = Date.now() - startTime;

		expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
			parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.duration - elapsedTime))
		);
		expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
		// Test that the target is still the same relative to the new width (the position in pixel should have change)
		expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, UProgress.Default.end), 0);
		up.destroy();
		$html.css('width', '');
	});

	it('shoud destroy the UProgress if the progress div is not in the document.body parent anymore', () => {
		window.removeEventListener.calls.reset();
		window.addEventListener.calls.reset();
		const up = new UProgress();

		up.start();
		const $uProgress = $('body > div.uprogress');

		$uProgress.remove();
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect(window.removeEventListener).toHaveBeenCalledWith(
			'resize',
			window.addEventListener.calls.mostRecent().args[1]
		);
		expect(window.removeEventListener).toHaveBeenCalledTimes(1);
		up.destroy();
	});

	it('shoud destroy the UProgress if the progress div is not in the div parent anymore', () => {
		loadFixtures('parent.html');
		window.removeEventListener.calls.reset();
		window.addEventListener.calls.reset();
		const $parent = $('#parent');

		$parent.css({
			height: '100px',
			'margin-right': '50px',
			'margin-left': '50px',
		});
		const up = new UProgress($parent[0]);

		up.start();
		const $uProgress = $('#parent > div.uprogress');

		$uProgress.remove();
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect(window.removeEventListener).toHaveBeenCalledWith(
			'resize',
			window.addEventListener.calls.mostRecent().args[1]
		);
		expect(window.removeEventListener).toHaveBeenCalledTimes(1);
		up.destroy();
	});

	it('shoud not resize the progress bar more often than the default resizeDebounce option', () => {
		const $html = $('html');
		const up = new UProgress();

		up.start();
		const $uProgress = $('body > div.uprogress');
		const $uProgressBar = $('body > div.uprogress > .bar');

		expect($uProgress.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		expect($uProgressBar.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		$html.css('width', `${$html.width() * 0.8}px`);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect($uProgress.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		expect($uProgressBar.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		$html.css('width', `${$html.width() * 0.7}px`);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce - 1);
		expect($uProgress.width()).not.toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		expect($uProgressBar.width()).not.toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		jasmine.clock().tick(1);
		expect($uProgress.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		expect($uProgressBar.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		up.destroy();
		$html.css('width', '');
	});

	it('shoud not change the width of the progressbar on resize event without document.body parent size change', () => {
		const $html = $('html');
		const up = new UProgress();

		up.start();
		const $uProgress = $('body > div.uprogress');
		const width = $uProgress.width();
		const $uProgressBar = $('body > div.uprogress > .bar');
		const barWidth = $uProgressBar.width();

		expect($uProgress.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		expect($uProgressBar.width()).toBe(
			Math.min(document.body.scrollWidth, document.documentElement.clientWidth, document.documentElement.offsetWidth)
		);
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect($uProgress.width()).toBe(width);
		expect($uProgressBar.width()).toBe(barWidth);
		up.destroy();
		$html.css('width', '');
	});

	it('shoud not change the width of the progressbar on resize event without div parent size change', () => {
		loadFixtures('parent.html');
		const $parent = $('#parent');
		const $html = $('html');

		$parent.css({
			height: '100px',
			'margin-right': '50px',
			'margin-left': '50px',
		});
		const up = new UProgress($parent[0]);

		up.start();
		const $uProgress = $('#parent > div.uprogress');
		const width = $uProgress.width();
		const $uProgressBar = $('#parent > div.uprogress > .bar');
		const barWidth = $uProgressBar.width();

		expect($uProgress.width()).toBe($parent.width());
		expect($uProgressBar.width()).toBe($parent.width());
		window.dispatchEvent(new CustomEvent('resize'));
		jasmine.clock().tick(UProgress.Default.resizeDebounce);
		expect($uProgress.width()).toBe(width);
		expect($uProgressBar.width()).toBe(barWidth);
		up.destroy();
		$html.css('width', '');
	});
});
