import {getVendorCSSProp, TRANSITION_END_EVENT} from '../src/js/util';
import {getCSSPosition, getExpectedCSSPosition, getExpectedCSSTransitionDuration} from './helpers/util';

describe('Start the progress bar', () => {
  let originalDefault;

  beforeAll(() => {
    originalDefault = Object.assign({}, UProgress.Default);
    UProgress.Default.start = 0.1;
    UProgress.Default.end = 0.9;
    UProgress.Default.duration = 50;
  });

  afterEach(() => {
    Object.assign(UProgress.Default, originalDefault);
  });

  it('shoud start and end at positions and move at the speed defined in Default options', () => {
    const up = new UProgress();
    const result = up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(result).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, UProgress.Default.end), 0);
    expect($uProgressBar[0].style.visibility).toBe('visible');
    expect($uProgressBar[0].style.opacity).toBe('1');
    up.set(0, 0, true);
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(
      getExpectedCSSPosition($uProgressBar, UProgress.Default.start),
      0
    );
    up.destroy();
  });

  it('shoud start and end at positions and move at the speed defined in Default options with RTL', () => {
    UProgress.Default.rtl = true;
    const up = new UProgress();
    const result = up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(result).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(UProgress.Default.duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(
      getExpectedCSSPosition($uProgressBar, UProgress.Default.end, UProgress.Default.rtl),
      0
    );
    expect($uProgressBar[0].style.visibility).toBe('visible');
    expect($uProgressBar[0].style.opacity).toBe('1');
    up.set(0, 0, true);
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(
      getExpectedCSSPosition($uProgressBar, UProgress.Default.start, UProgress.Default.rtl),
      0
    );
    up.destroy();
  });

  it('shoud start and end at positions and move at the speed defined in options passed to constructor', () => {
    const options = {
      start: 0.2,
      end: 0.8,
      duration: 150,
    };
    const up = new UProgress(document.body, options);
    const result = up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(result).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(options.duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, options.end), 0);
    up.set(0, 0, true);
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, options.start), 0);
    up.destroy();
  });

  it('shoud start and end at positions and move at the speed defined in options passed to constructor with RTL', () => {
    const options = {
      rtl: true,
      start: 0.25,
      end: 0.85,
      duration: 180,
    };
    const up = new UProgress(document.body, options);
    const result = up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(result).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(options.duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(
      getExpectedCSSPosition($uProgressBar, options.end, options.rtl),
      0
    );
    up.set(0, 0, true);
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(
      getExpectedCSSPosition($uProgressBar, options.start, options.rtl),
      0
    );
    up.destroy();
  });

  it('shoud start and end at positions and move at the speed defined in options passed to options method', () => {
    const options = {
      start: 0.3,
      end: 0.7,
      duration: 100,
    };
    const up = new UProgress();

    up.options(options);
    expect(up.start()).toBeTruthy();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(options.duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, options.end), 0);
    up.set(0, 0, true);
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, options.start), 0);
    up.destroy();
  });

  it('shoud start and end at positions and move immediatly', () => {
    const options = {duration: 0};
    const up = new UProgress();

    up.options(options);
    expect(up.start()).toBeTruthy();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(0))
    );
    expect($uProgressBar.css('transition-property')).toBe('none');
    up.destroy();
  });

  it('shoud start and end transition on css property "transform"', done => {
    const options = {duration: 20};
    const up = new UProgress();

    up.options(options);
    expect(up.start()).toBeTruthy();
    const $uProgressBar = $('body > div.uprogress > .bar');

    $uProgressBar.one(TRANSITION_END_EVENT, event => {
      if (event.originalEvent.propertyName === getVendorCSSProp('transform')) {
        up.destroy();
        done();
      }
    });
  });

  it('shoud consider start positions lesser than 0 to be 0', () => {
    const options = {start: -2};
    const up = new UProgress();

    up.options(options);
    const result = up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(result).toBeTruthy();
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, UProgress.Default.end), 0);
    up.set(0, 0, true);
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 0), 0);
    up.destroy();
  });

  it('shoud consider start positions greater than 0.99 to be 0.99', () => {
    const options = {
      start: 2,
      end: 0.99,
    };
    const up = new UProgress();

    up.options(options);
    const result = up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(result).toBeTruthy();
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, options.end), 0);
    up.set(0, 0, true);
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 0.99), 0);
    up.destroy();
  });

  it('shoud consider end positions lesser than start position to be equal to start position', () => {
    const options = {
      start: 0.9,
      end: 0.5,
    };
    const up = new UProgress();

    up.options(options);
    const result = up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(result).toBeTruthy();
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, options.start), 0);
    up.destroy();
  });

  it('shoud consider end positions greater than 1 to be 1', () => {
    const options = {end: 2};
    const up = new UProgress();

    up.options(options);
    const result = up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(result).toBeTruthy();
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);
    up.destroy();
  });

  it('shoud consider a negative duration to be 0', () => {
    const options = {duration: -100};
    const up = new UProgress();

    up.options(options);
    expect(up.start()).toBeTruthy();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(parseFloat($uProgressBar.css('transition-duration'))).toBe(parseFloat(getExpectedCSSTransitionDuration(0)));
    expect($uProgressBar.css('transition-property')).toBe('none');
    up.destroy();
  });

  it('shoud return false when calling start while already started', () => {
    const up = new UProgress();

    up.start();
    expect(up.start()).toBeFalsy();
    up.destroy();
  });

  it('shoud return false and not throw an error when starting after destroying', () => {
    const up = new UProgress();

    up.start();
    up.destroy();
    expect(up.start).not.toThrow();
    expect(up.start()).toBeFalsy();
  });
});
