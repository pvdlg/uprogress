/* eslint-env jasmine, jquery, browser */
/* global UProgress */

describe('Destruction of the progress bar', () => {
  beforeAll(() => {
    spyOn(window, 'removeEventListener').and.callThrough();
    spyOn(window, 'addEventListener').and.callThrough();
  });

  it('shoud remove progress bar from the DOM', () => {
    const up = new UProgress();

    up.start();
    const $uProgress = $('body > div.uprogress');
    const $uProgressBar = $('body > div.uprogress > .bar');
    const $uProgressBlur = $('body > div.uprogress > .bar > .blur');

    up.destroy();
    expect($uProgress[0]).not.toBeInDOM();
    expect($uProgressBar[0]).not.toBeInDOM();
    expect($uProgressBlur[0]).not.toBeInDOM();
  });

  it('shoud not throw an error when destroying twice', () => {
    const up = new UProgress();

    up.destroy();
    expect(up.destroy).not.toThrow();
  });

  it('shoud not remove "resize" event listener from the window until the last progress is destroyed', () => {
    window.removeEventListener.calls.reset();
    const up = new UProgress();
    const up2 = new UProgress();

    up.destroy();
    expect(window.removeEventListener).not.toHaveBeenCalled();
    up2.destroy();
  });

  it('shoud remove "resize" event listener from the window when the last progress bar is destroyed', () => {
    window.removeEventListener.calls.reset();
    window.addEventListener.calls.reset();
    const up = new UProgress();
    const up2 = new UProgress();

    up.destroy();
    up2.destroy();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      window.addEventListener.calls.mostRecent().args[1]
    );
    expect(window.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
