/* eslint-env jasmine, jquery, browser */
/* global UProgress */

import ready from 'dom101/ready';
import on from 'dom101/on';
import './clipboard'; // eslint-disable-line import/no-unassigned-import
import './examples'; // eslint-disable-line import/no-unassigned-import

const browserPrefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
const uProgressClases = [
  'uprogress',
  'uprogress-bottom-orange',
  'uprogress-multi',
  'uprogress-purple',
  'uprogress-red',
  'uprogress-green',
];

ready(() => {
  const sidebar = document.getElementById('sidebar');

  if (sidebar) {
    for (let i = 0; i < browserPrefix.length; i += 1) {
      sidebar.style.position = `${browserPrefix[i]}sticky`;
    }

    if (sidebar.style.position !== '') {
      sidebar.classList.add('is-sticky');
    }
  }
});

ready(() => {
  const indexStartBtn = document.getElementById('index-start');
  const indexDoneBtn = document.getElementById('index-done');
  const indexChangeColorBtn = document.getElementById('index-change-color');
  let currentClass = 0;

  if (indexStartBtn && indexDoneBtn) {
    let uProgress;

    indexDoneBtn.disabled = true;
    indexChangeColorBtn.disabled = true;

    on(indexStartBtn, 'click', () => {
      if (!uProgress) {
        uProgress = new UProgress();
      }

      indexStartBtn.disabled = true;
      indexDoneBtn.disabled = false;
      indexChangeColorBtn.disabled = false;
      uProgress.start();
    });

    on(indexChangeColorBtn, 'click', () => {
      if (uProgress) {
        currentClass += 1;
        currentClass = currentClass >= uProgressClases.length ? currentClass - uProgressClases.length : currentClass;
        console.log(currentClass);
        uProgress.options({class: uProgressClases[currentClass]});
      }
    });

    on(indexDoneBtn, 'click', () => {
      if (uProgress) {
        indexStartBtn.disabled = false;
        indexDoneBtn.disabled = true;
        indexChangeColorBtn.disabled = true;
        uProgress.done();
      }
    });
  }
});
