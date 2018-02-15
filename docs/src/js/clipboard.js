/* eslint-env browser */

import Clipboard from 'clipboard';
import ready from 'dom101/ready';
import qa from 'dom101/query-selector-all';
import each from 'dom101/each';
import on from 'dom101/on';

ready(() => {
	each(qa('.example ~ .highlight'), hl => {
		const copy = '<button class="copy">Copy</button>';

		hl.insertAdjacentHTML('beforeend', copy);
	});

	const clipboard = new Clipboard('.copy', {
		target(trigger) {
			return trigger.previousSibling;
		},
	});

	clipboard.on('success', el => {
		showTooltip(el.trigger, 'Copied!');
		el.clearSelection();
	});

	const btns = document.querySelectorAll('.copy');

	for (let i = 0, {length} = btns; i < length; i++) {
		on(btns[i], 'mouseleave', clearTooltip);
		on(btns[i], 'blur', clearTooltip);
	}
});

function clearTooltip(el) {
	el.currentTarget.setAttribute('class', 'copy');
	el.currentTarget.removeAttribute('aria-label');
}

function showTooltip(elem, msg) {
	elem.setAttribute('class', 'copy tooltipped tooltipped-n');
	elem.setAttribute('aria-label', msg);
}
