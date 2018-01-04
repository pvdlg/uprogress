/* eslint-env jasmine, jquery, browser */
/* global UProgress, loadFixtures, loadStyleFixtures, setFixtures, appendSetFixtures */

describe('Set cutom css class', () => {
  it('"uprogress", the progress bar shoud be positionned at the top of parent (document.body)', () => {
    const up = new UProgress();

    up.start();
    const $uProgress = $('body > div.uprogress');
    const $uProgressBar = $('body > div.uprogress > .bar');

    expect($uProgress[0].getBoundingClientRect().top).toBe(document.documentElement.getBoundingClientRect().top);
    expect($uProgressBar[0].getBoundingClientRect().top).toBe(document.documentElement.getBoundingClientRect().top);
    up.destroy();
  });

  it('"uprogress-bottom", the progress bar shoud be positionned at the bottom of parent (document.body)', () => {
    loadStyleFixtures('uprogress-bottom.css');
    const up = new UProgress({class: 'uprogress-bottom'});

    up.start();
    const $uProgress = $('body > div.uprogress-bottom');
    const $uProgressBar = $('body > div.uprogress-bottom > .bar');

    expect($uProgress[0].getBoundingClientRect().bottom).toBe(
      Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    );
    expect($uProgressBar[0].getBoundingClientRect().bottom).toBe(
      Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    );
    up.destroy();
  });

  it('"uprogress", the progress bar shoud be positionned at the top of parent (div)', () => {
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

    expect($uProgress[0].getBoundingClientRect().top).toBe($parent[0].getBoundingClientRect().top);
    expect($uProgressBar[0].getBoundingClientRect().top).toBe($parent[0].getBoundingClientRect().top);
    up.destroy();
  });

  it('"uprogress-bottom", the progress bar shoud be positionned at the bottom of parent (div)', () => {
    loadFixtures('parent.html');
    loadStyleFixtures('uprogress-bottom.css');
    const $parent = $('#parent');

    $parent.css({
      width: '200px',
      height: '100px',
      left: '100px',
      top: '100px',
      position: 'absolute',
    });
    const up = new UProgress($parent[0], {class: 'uprogress-bottom'});

    up.start();
    const $uProgress = $('#parent > div.uprogress-bottom');
    const $uProgressBar = $('#parent > div.uprogress-bottom > .bar');

    expect($uProgress[0].getBoundingClientRect().bottom).toBe($parent[0].getBoundingClientRect().bottom);
    expect($uProgressBar[0].getBoundingClientRect().bottom).toBe($parent[0].getBoundingClientRect().bottom);
    up.destroy();
  });

  it('"uprogress-large", the progress bar shoud have a large height', () => {
    loadStyleFixtures('uprogress-large.css');
    const up = new UProgress({class: 'uprogress-large'});

    up.start();
    const $uProgress = $('body > div.uprogress-large');
    const $uProgressBar = $('body > div.uprogress-large > .bar');
    const $uProgressBlur = $('body > div.uprogress-large > .bar > .blur');

    // eslint-disable-next-line no-magic-numbers
    expect($uProgress).toHaveCss({height: `${10 * 4}px`});
    expect($uProgressBar).toHaveCss({height: '10px'});
    // eslint-disable-next-line no-magic-numbers
    expect($uProgressBlur).toHaveCss({width: `${10 * 50}px`});
    up.destroy();
  });

  it('"uprogress-custom-color", the progress bar background and the blur box-shadow shoud have a custom color', () => {
    loadStyleFixtures('uprogress-custom-color.css');
    const up = new UProgress({class: 'uprogress-custom-color'});

    up.start();
    const $uProgressBar = $('body > div.uprogress-custom-color > .bar');
    const $uProgressBlur = $('body > div.uprogress-custom-color > .bar > .blur');
    const $fixture = $('<div></div>')
      .css('background-color', 'purple')
      .css('color', 'purple');

    setFixtures($fixture);
    expect($uProgressBar).toHaveCss({'background-color': $fixture.css('background-color')});
    expect(
      $uProgressBlur.css('box-shadow').indexOf($fixture.css('color')) !== -1 ||
        $uProgressBlur.css('box-shadow').indexOf('purple') !== -1
    ).toBeTruthy();
    expect($uProgressBar.css('animation-name')).toBe('none');
    expect($uProgressBar.css('animation-duration')).toBe('0s');
    up.destroy();
  });

  it('"uprogress-multi-color", the progress bar should have a background-color, animation and background-image', () => {
    loadStyleFixtures('uprogress-multi-color.css');
    const up = new UProgress({class: 'uprogress-multi-color'});

    up.start();
    const $uProgressBar = $('body > div.uprogress-multi-color > .bar');
    const $uProgressBlur = $('body > div.uprogress-multi-color > .bar > .blur');
    const $fixturePurple = $('<div></div>')
      .css('background-color', 'purple')
      .css('color', 'purple');
    const $fixtureBlue = $('<div></div>')
      .css('background-color', 'blue')
      .css('color', 'blue');
    const $fixtureRed = $('<div></div>')
      .css('background-color', 'red')
      .css('color', 'red');
    const $fixtureDiv = $('<div></div>');

    appendSetFixtures($fixturePurple);
    appendSetFixtures($fixtureBlue);
    appendSetFixtures($fixtureRed);
    appendSetFixtures($fixtureDiv);
    expect($uProgressBar).toHaveCss({'background-color': $fixturePurple.css('background-color')});
    expect($uProgressBlur).toHaveCss({position: $fixtureDiv.css('position')});
    expect($uProgressBar).not.toHaveCss({'animation-name': $fixtureDiv.css('animation-name')});
    expect($uProgressBar.css('background-image')).toContain('gradient');
    up.destroy();
  });
});
