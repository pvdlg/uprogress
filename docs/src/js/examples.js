/* eslint-env jasmine, jquery, browser */
/* global UProgress */
/* eslint-disable no-magic-numbers, require-jsdoc */

import ready from 'dom101/ready';
import on from 'dom101/on';

function start(idx, uProgresses, startBtns, doneBtns) {
  for (let i = 0, {length} = uProgresses; i < length; i++) {
    uProgresses[i].done();
    startBtns[i].disabled = false;
    doneBtns[i].disabled = true;
  }

  startBtns[idx].disabled = true;
  doneBtns[idx].disabled = false;
  uProgresses[idx].start();
}

function done(idx, uProgresses, startBtns, doneBtns) {
  startBtns[idx].disabled = false;
  doneBtns[idx].disabled = true;
  uProgresses[idx].done();
}

ready(() => {
  const uProgress1 = new UProgress();
  const uProgress2 = new UProgress({class: 'uprogress-purple'});
  const uProgress3 = new UProgress({rtl: true});
  const uProgress4 = new UProgress(document.getElementById('container-expl'));
  const expl1StartBtn = document.getElementById('expl1-start');
  const expl1DoneBtn = document.getElementById('expl1-done');
  const expl2StartBtn = document.getElementById('expl2-start');
  const expl2DoneBtn = document.getElementById('expl2-done');
  const expl2PurpleBtn = document.getElementById('expl2-purple');
  const expl2LargeBtn = document.getElementById('expl2-lg');
  const expl2BottomBtn = document.getElementById('expl2-bottom');
  const expl2MultiBtn = document.getElementById('expl2-multi');
  const expl3StartBtn = document.getElementById('expl3-start');
  const expl3DoneBtn = document.getElementById('expl3-done');
  const expl4StartBtn = document.getElementById('expl4-start');
  const expl4DoneBtn = document.getElementById('expl4-done');
  const uProgresses = [uProgress1, uProgress2, uProgress3, uProgress4];
  const startBtns = [expl1StartBtn, expl2StartBtn, expl3StartBtn, expl4StartBtn];
  const doneBtns = [expl1DoneBtn, expl2DoneBtn, expl3DoneBtn, expl4DoneBtn];

  if (expl1StartBtn && expl1DoneBtn) {
    expl1DoneBtn.disabled = true;

    on(expl1StartBtn, 'click', () => {
      start(0, uProgresses, startBtns, doneBtns);
    });

    on(expl1DoneBtn, 'click', () => {
      done(0, uProgresses, startBtns, doneBtns);
    });
  }

  if (expl2StartBtn && expl2DoneBtn) {
    expl2DoneBtn.disabled = true;

    on(expl2StartBtn, 'click', () => {
      start(1, uProgresses, startBtns, doneBtns);
    });

    on(expl2PurpleBtn, 'click', () => {
      uProgress2.options({class: 'uprogress-purple'});
    });

    on(expl2LargeBtn, 'click', () => {
      uProgress2.options({class: 'uprogress-lg'});
    });

    on(expl2BottomBtn, 'click', () => {
      uProgress2.options({class: 'uprogress-bottom'});
    });

    on(expl2MultiBtn, 'click', () => {
      uProgress2.options({class: 'uprogress-multi'});
    });

    on(expl2DoneBtn, 'click', () => {
      done(1, uProgresses, startBtns, doneBtns);
    });
  }

  if (expl3StartBtn && expl3DoneBtn) {
    expl3DoneBtn.disabled = true;

    on(expl3StartBtn, 'click', () => {
      start(2, uProgresses, startBtns, doneBtns);
    });

    on(expl3DoneBtn, 'click', () => {
      done(2, uProgresses, startBtns, doneBtns);
    });
  }

  if (expl4StartBtn && expl4DoneBtn) {
    expl4DoneBtn.disabled = true;

    on(expl4StartBtn, 'click', () => {
      start(3, uProgresses, startBtns, doneBtns);
    });

    on(expl4DoneBtn, 'click', () => {
      done(3, uProgresses, startBtns, doneBtns);
    });
  }
});

/* eslint-enable no-magic-numbers, require-jsdoc */
