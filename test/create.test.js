describe('Creation of the progress bar', () => {
  let originalDefault;

  beforeAll(() => {
    originalDefault = Object.assign({}, UProgress.Default);
    spyOn(window, 'addEventListener').and.callThrough();
    spyOn(window, 'removeEventListener').and.callThrough();
  });

  afterEach(() => {
    Object.assign(UProgress.Default, originalDefault);
  });

  it('shoud be a child of body with CSS class "uprogress" a bar div with CSS class "bar" and a blur div CSS class "blur"', () => {
    const up = new UProgress();

    up.start();
    const $uProgress = $('body > div.uprogress');
    const $uProgressBar = $('body > div.uprogress > .bar');
    const $uProgressBlur = $('body > div.uprogress > .bar > .blur');

    expect($uProgress).toExist();
    expect($uProgressBar).toExist();
    expect($uProgressBlur).toExist();
    up.destroy();
  });

  it('shoud add the class rtl when option rtl is true', () => {
    const up = new UProgress({rtl: true});

    up.start();
    const $uProgress = $('body > div.uprogress.rtl');

    expect($uProgress).toExist();
    up.destroy();
  });

  it('shoud have visibility style set to "hidden"', () => {
    const up = new UProgress();
    const $uProgressBar = $('body > div > .bar');

    expect($uProgressBar[0].style.visibility).toBe('hidden');
    up.destroy();
  });

  it('shoud have the position set to "fixed" if the parent is the document body', () => {
    const up = new UProgress();

    up.start();
    const $uProgress = $('body > div.uprogress');

    expect($uProgress[0].style.position).toBe('fixed');
    up.destroy();
  });

  it('shoud have the role attribute set to "bar"', () => {
    const up = new UProgress();

    up.start();
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect($uProgressBar).toHaveAttr('role', 'bar');
    up.destroy();
  });

  it('shoud have a width equal to the parent (document.body)', () => {
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
    up.destroy();
  });

  it('shoud have a width equal to the parent (div)', () => {
    loadFixtures('parent.html');
    const $parent = $('#parent');

    $parent.css({
      width: '200px',
      height: '100px',
      left: '100px',
      top: '100px',
      position: 'absolute',
    });
    const up = new UProgress($parent[0]);

    up.start();
    const $uProgress = $('#parent > div.uprogress');
    const $uProgressBar = $('#parent > div.uprogress > .bar');

    expect($uProgress.width()).toBe($parent[0].clientWidth);
    expect($uProgressBar.width()).toBe($parent[0].clientWidth);
    up.destroy();
  });

  it('shoud have the position set to "absolute" if the parent is not the document body', () => {
    loadFixtures('parent.html');
    const $parent = $('#parent');

    $parent.css({
      width: '200px',
      height: '100px',
      left: '100px',
      top: '100px',
      position: 'absolute',
    });
    const up = new UProgress($parent[0]);

    up.start();
    const $uProgress = $('#parent > div.uprogress');

    expect($uProgress[0].style.position).toBe('absolute');
    up.destroy();
  });

  it('shoud register once to the "resize" event on the window', () => {
    window.addEventListener.calls.reset();
    const up = new UProgress();

    expect(window.addEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
    expect(window.addEventListener).toHaveBeenCalledTimes(1);
    up.destroy();
  });

  it('shoud not register to the "resize" event on the window when a second progress bar is created', () => {
    window.addEventListener.calls.reset();
    const up = new UProgress();
    const up2 = new UProgress();

    expect(window.addEventListener).toHaveBeenCalledTimes(1);
    up.destroy();
    up2.destroy();
  });

  it('shoud have the CSS classes for the wrapper, the progress bar and the blur defined in default options', () => {
    UProgress.Default.class = 'uprogress3 test-class';
    UProgress.Default.barClass = 'uprogress3-bar test-class-bar';
    UProgress.Default.blurClass = 'uprogress3-blur test-class-blur';
    const up = new UProgress();

    up.start();
    const $uProgress = $('body > div.uprogress3.test-class');
    const $uProgressBar = $('body > div.uprogress3.test-class > .uprogress3-bar.test-class-bar');
    const $uProgressBlur = $(
      'body > div.uprogress3.test-class > .uprogress3-bar.test-class-bar > .uprogress3-blur.test-class-blur'
    );

    expect($uProgress).toExist();
    expect($uProgressBar).toExist();
    expect($uProgressBlur).toExist();
    up.destroy();
    Object.assign(UProgress.Default, originalDefault);
  });

  it('shoud have the CSS classes for the wrapper, the progress bar and the blur defined in constructor options', () => {
    const options = {
      class: 'uprogress4',
      blurClass: 'uprogress4-blur',
      barClass: 'uprogress4-bar',
    };
    const up = new UProgress(document.body, options);

    up.start();
    const $uProgress = $(`body > div.${options.class}`);
    const $uProgressBar = $(`body > div.${options.class} > .${options.barClass}`);
    const $uProgressBlur = $(`body > div.${options.class} > .${options.barClass} > .${options.blurClass}`);

    expect($uProgress).toExist();
    expect($uProgressBar).toExist();
    expect($uProgressBlur).toExist();
    up.destroy();
  });

  it('shoud accept options as only parameter', () => {
    const options = {
      class: 'uprogress5',
      barClass: 'uprogress5-bar',
      blurClass: 'uprogress5-blur',
    };
    const up = new UProgress(options);

    up.start();
    const $uProgress = $(`body > div.${options.class}`);
    const $uProgressBar = $(`body > div.${options.class} > .${options.barClass}`);
    const $uProgressBlur = $(`body > div.${options.class} > .${options.barClass} > .${options.blurClass}`);

    expect($uProgress).toExist();
    expect($uProgressBar).toExist();
    expect($uProgressBlur).toExist();
    up.destroy();
  });
});
