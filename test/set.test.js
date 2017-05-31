import {getVendorCSSProp, TRANSITION_END_EVENT} from '../src/js/util';
import {getCSSPosition, getExpectedCSSPosition, getExpectedCSSTransitionDuration} from './helpers/util';

describe('Set the target and speed of the progress bar', () => {
  let originalDefault;

  beforeAll(() => {
    originalDefault = Object.assign({}, UProgress.Default);
    UProgress.Default.start = 0.1;
    UProgress.Default.end = 0.9;
    UProgress.Default.duration = 40;
    UProgress.Default.doneDuration = 5;
    UProgress.Default.fadeDuration = 10;
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate();
  });

  afterEach(() => {
    Object.assign(UProgress.Default, originalDefault);
    jasmine.clock().uninstall();
  });

  it('shoud move to the position at the speed in parameter', () => {
    const duration = 250;
    const target = 0.5;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, target)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target), 0);

    up.destroy();
  });

  it('shoud move to the position at the speed in parameter with RTL', () => {
    UProgress.Default.rtl = true;
    const duration = 250;
    const target = 0.5;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, target)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(
      getExpectedCSSPosition($uProgressBar, target, UProgress.Default.rtl),
      0
    );

    up.destroy();
  });

  it('shoud move at the speed in parameter to the position previously set', () => {
    const duration1 = 250;
    const duration2 = 150;
    const target1 = 0.5;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration1, target1)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration1))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target1), 0);
    jasmine.clock().tick(duration1 / 2);

    // Set only duration (target should be the one previously set)
    expect(up.set(duration2)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration2))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target1), 0);

    up.destroy();
  });

  it('shoud return false if not started', () => {
    const duration = 250;
    const up = new UProgress();

    expect(up.set(duration)).toBeFalsy();
    up.destroy();
  });

  it('shoud return false if no duration is set', () => {
    const up = new UProgress();

    up.start();
    expect(up.set()).toBeFalsy();
    up.destroy();
  });

  it('shoud not move if the position is less than current position', () => {
    const duration1 = 250;
    const duration2 = 150;
    const duration3 = 350;
    const duration4 = 200;
    const target1 = 0.5;
    const target2 = 0.3;
    const target3 = 0.5;
    const target4 = 0.8;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration1, target1)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration1))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target1), 0);
    jasmine.clock().tick(duration1);

    // If try to go backward, return false and don't change duration/target
    expect(up.set(duration2, target2)).toBeFalsy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration1))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target1), 0);

    // If try to go backward, return false and don't change duration/target
    expect(up.set(duration3, target3)).toBeFalsy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration1))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target1), 0);

    // If try to go forward, return true and change duration/target
    expect(up.set(duration4, target4)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration4))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target4), 0);
    up.destroy();
  });

  it('shoud move to the position parameter even it is less than current position if force is true', () => {
    const duration1 = 250;
    const duration2 = 150;
    const target1 = 0.5;
    const target2 = 0.3;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration1, target1)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration1))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target1), 0);
    jasmine.clock().tick(duration1);

    // Even if go backward, return true and change duration/target
    expect(up.set(duration2, target2, true)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration2))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target2), 0);
    up.destroy();
  });

  it('shoud use the end target as default target parameter', () => {
    const duration = 500;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, UProgress.Default.end), 0);
    up.destroy();
  });

  it('shoud use the end target as default target parameter when target parameter is null', () => {
    const duration = 500;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, null)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, UProgress.Default.end), 0);
    up.destroy();
  });

  it('shoud use the last target set as default target parameter', () => {
    const duration1 = 500;
    const duration2 = 300;
    const target = 0.7;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration1, target)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration1))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target), 0);

    expect(up.set(duration2)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration2))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target), 0);
    up.destroy();
  });

  it('shoud complete the progress bar if the target set is 1', done => {
    const duration = 12;
    const up = new UProgress();

    expect(up.start()).toBeTruthy();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, 1)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);

    $uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
      if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
        expect(transformEvent.originalEvent.elapsedTime).toBeCloseTo(duration / 1000);
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

  it('shoud complete the progress bar if the target set is greater than 1', done => {
    const duration = 11;
    const up = new UProgress();

    expect(up.start()).toBeTruthy();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, 2)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, 1), 0);

    $uProgressBar.one(TRANSITION_END_EVENT, transformEvent => {
      if (transformEvent.originalEvent.propertyName === getVendorCSSProp('transform')) {
        expect(transformEvent.originalEvent.elapsedTime).toBeCloseTo(duration / 1000);
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

  it('shoud move to the start position if target is less than start position', () => {
    const duration = 13;
    const target = -1;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, target, true)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBeCloseTo(
      parseFloat(getExpectedCSSTransitionDuration(duration))
    );
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('transform'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(
      getExpectedCSSPosition($uProgressBar, UProgress.Default.start),
      0
    );

    up.destroy();
  });

  it('shoud move to the target position immediatly if duration is negative', () => {
    const duration = -12;
    const target = 0.5;
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, target)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBe(parseFloat(getExpectedCSSTransitionDuration(0)));
    expect($uProgressBar.css('transition-property')).toBe(getVendorCSSProp('none'));
    expect(getCSSPosition($uProgressBar)).toBeCloseTo(getExpectedCSSPosition($uProgressBar, target), 0);

    up.destroy();
  });

  it('shoud complete the progress bar if the target set is greater than 1 and duration 0', done => {
    const duration = 0;
    const up = new UProgress();

    expect(up.start()).toBeTruthy();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, 2)).toBeTruthy();
    expect(parseFloat($uProgressBar.css('transition-duration'))).toBe(
      parseFloat(getExpectedCSSTransitionDuration(duration))
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

  it('shoud complete the progress bar if the target set is greater than 1 and duration negative', done => {
    const duration = -11;
    const up = new UProgress();

    expect(up.start()).toBeTruthy();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect(up.set(duration, 2)).toBeTruthy();
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
});
