---
title: Javascript API
subtitle: Public Javascript classes, function and variables
sidebar_class: js
layout: doc
position: 2
heading: true
anchor: true
---

  
{: .js.class.global name="UProgress" data-menu-title="UProgress"}
# UProgress
Creates and control a µProgress.

**Kind**: global class  
  
{: .js.constructor name="new_UProgress_new" data-menu-title="new UProgress"}
## new UProgress([parent], [opts], [rtl])
- Create a new UProgress instance.
- Create a `div` for the µProgress and add it to the `parent`.
- Register to the `resize` event.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [parent] | <code>HTMLElement</code> | <code>document.body</code> | The `HTMLElement` on which the µProgress will stand on top of. |
| [opts] | <code>Object</code> |  | The µProgress configutation. |
| [rtl] | <code>boolean</code> | <code>false</code> | `true` to move the µProgress from right to left, `false` for left to right. |
| [opts.start] | <code>number</code> | <code>0.01</code> | The position in percentage (.35 is 35%, 1 is 100%) at which the µProgress starts. |
| [opts.end] | <code>number</code> | <code>0.99</code> | The position in percentage (.35 is 35%, 1 is 100%) the µProgress is moving toward when started. Once reached, it will stop until [set](#UProgress+set) or [done](#UProgress+done) are called. |
| [opts.duration] | <code>number</code> | <code>25000</code> | The durarion in ms it takes for the µProgress to go from `opts.start` to `opts.end`. |
| [opts.doneDuration] | <code>number</code> | <code>100</code> | The duration in ms that the µProgress take to complete when [done](#UProgress+done) is called. |
| [opts.fadeDuration] | <code>number</code> | <code>200</code> | The duration in ms the µProgress takes to fade out after it has completed. |
| [opts.class] | <code>number</code> | <code>&#x27;uprogress&#x27;</code> | The CSS class to set on the µProgress element. |
| [opts.barClass] | <code>number</code> | <code>&#x27;bar&#x27;</code> | The CSS class to set on the µProgress bar element. |
| [opts.blurClass] | <code>number</code> | <code>&#x27;blur&#x27;</code> | The CSS class to set on the µProgress blur element. |

**Example**  
Create a new µProgress on top of the viewport with default options.
```javascript
const uProgress = new UProgress();
uProgress.start();
```
**Example**  
Create a new µProgress on top of a modal with default options.
```javascript
const uProgress = new UProgress(document.getElementById('my-modal'));
uProgress.start();
```
**Example**  
Create a new µProgress on top of the viewport with custom options.
```javascript
const uProgress = new UProgress({
  start: 0.05,
  duration: 30000
});
uProgress.start();
```

{: .js.function.instance name="UProgress+start" data-menu-title="uProgress.start"}
## uProgress.start() ⇒ <code>boolean</code>
Display the µProgress and start its progress from `opts.start` to `opts.end` at a speed corresponding to `opts.duration`. Has no effect if the µProgress is already started.

**Kind**: instance method of [<code>UProgress</code>](#UProgress)  
**Returns**: <code>boolean</code> - `true` if the µProgress has started, `false` otherwise.  
**Example**  
Start the µProgress.
```javascript
const uProgress = new UProgress();
uProgress.start();
// true
```

{: .js.function.instance name="UProgress+set" data-menu-title="uProgress.set"}
## uProgress.set(duration, [target], [force]) ⇒ <code>boolean</code>
Change the µProgress `target` and the speed at which it reaches it. Useful to give a more accurate progress of multiple sequentials tasks.
If the value of `duration` parameter is equal or greater than 1, then the µProgress will automatically fade out once it reaches 100% progress (equivalent to calling [done](#UProgress+done) with `opts.doneDuration` = `duration`).

**Kind**: instance method of [<code>UProgress</code>](#UProgress)  
**Returns**: <code>boolean</code> - `true` if the µProgress `duration` or `target` has been changed, `false` otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| duration | <code>number</code> |  | The duration in ms the µProgress will take to reach its `target`. |
| [target] | <code>number</code> |  | The position in percentage (.35 is 35%, 1 is 100%) the µProgress will moving toward. Once reached, it will stop until [set](#UProgress+set) or [done](#UProgress+done) are called. If `undefined` or `null`, the µProgress target will stay the same. |
| [force] | <code>boolean</code> | <code>false</code> | `true` to set the requested `target` even if ti makes the µProgress moves backward. |

**Example**  
Update µProgress speed based on tasks progress.
```javascript
// doHeavyTask calls a callback when done and is expected to takes up to 7s
// doLightTask calls a callback when done and is expected to takes up to 3s
const uProgress = new UProgress({
  duration: 7000
  end: 0.7
});
uProgress.start();
doHeavyTask(() => {
  // when heavy task is done
  uProgress.set(3000, .99);
  doLightTask(() => {
    // When light task is done
    uProgress.done();
  });
});
```

{: .js.function.instance name="UProgress+done" data-menu-title="uProgress.done"}
## uProgress.done(destroy) ⇒ <code>boolean</code>
Gracefully complete the µProgress by moving quickly to 100% progress and then fading out. It will moves to 100% at the speed corresponding to `opts.doneDuration` and then fade out with the duration of `opts.fadeDuration`.
Has no effect if the µProgress is not started or if [done](#UProgress+done)).

**Kind**: instance method of [<code>UProgress</code>](#UProgress)  
**Returns**: <code>boolean</code> - `true` if the µProgress is going to be completed, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| destroy | <code>boolean</code> | `true` to automatically call [destroy](#UProgress+destroy) once the µProgress has completed. |

**Example**  
Complete the µProgress once the monitored task is done.
```javascript
// `doTask` calls a callback when done
const uProgress = new UProgress();
uProgress.start();
doTask(() => {
  // when task is done,
  uProgress.done();
});
```

{: .js.function.instance name="UProgress+status" data-menu-title="uProgress.status"}
## uProgress.status() ⇒ <code>Status</code> \| <code>boolean</code>
Get the [Status](#UProgress..Status) of the µProgress if it's not destroyed, `false` otherwise.

**Kind**: instance method of [<code>UProgress</code>](#UProgress)  
**Returns**: <code>Status</code> \| <code>boolean</code> - The current [Status](#UProgress..Status) or `false`.  
**Example**  
Get the status.
```javascript
const uProgress = new UProgress({duration: 20000});
uProgress.start();
setTimeout(() => {
  uProgress.status();
  // {target: 0.99, duration: 15000, progress: 0.25}
}, 5000);
```

{: .js.function.instance name="UProgress+options" data-menu-title="uProgress.options"}
## uProgress.options([opts], [rtl]) ⇒ [<code>UProgress</code>](#UProgress)
Update the µProgress instance configuration.

**Kind**: instance method of [<code>UProgress</code>](#UProgress)  
**Returns**: [<code>UProgress</code>](#UProgress) - this, chainable  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  | The µProgress configutation. |
| [rtl] | <code>boolean</code> | <code>false</code> | `true` to move the µProgress from right to left, `false` for left to right.Will be used on next call to [start](#UProgress+start). |
| [opts.start] | <code>number</code> | <code>0.01</code> | The position in percentage (.35 is 35%, 1 is 100%) at which the µProgress starts. Will be used on next call to [start](#UProgress+start). |
| [opts.end] | <code>number</code> | <code>0.99</code> | The position in percentage (.35 is 35%, 1 is 100%) the µProgress is moving toward when started. Once reached, it will stop until [set](#UProgress+set) or [done](#UProgress+done) are called. Will be used on next call to [start](#UProgress+start). |
| [opts.duration] | <code>number</code> | <code>25000</code> | The durarion in ms it takes for the µProgress to go from `opts.start` to `opts.end`. Will be used on next call to [start](#UProgress+start). |
| [opts.doneDuration] | <code>number</code> | <code>100</code> | The duration in ms that the µProgress take to complete when [done](#UProgress+done) is called. Will be used on next call to [done](#UProgress+done). |
| [opts.fadeDuration] | <code>number</code> | <code>200</code> | The duration in ms the µProgress takes to fade out after it has completed. Will be used on next call to [done](#UProgress+done). |
| [opts.class] | <code>number</code> | <code>&#x27;uprogress&#x27;</code> | The CSS class to set on the the µProgress element. Will be applied right away. |
| [opts.barClass] | <code>number</code> | <code>&#x27;bar&#x27;</code> | The CSS class to set on the the µProgress bar element. Will be applied right away. |
| [opts.blurClass] | <code>number</code> | <code>&#x27;blur&#x27;</code> | The CSS class to set on the the µProgress blur element. Will be applied right away. |

**Example**  
Change duration.
```javascript
const uProgress = new UProgress();
uProgress.options({duration: 20000}).start();
setTimeout(() => {
  uProgress.status();
  // {target: 0.99, duration: 5000, progress: 0.75}
}, 15000);
```

{: .js.function.instance name="UProgress+refresh" data-menu-title="uProgress.refresh"}
## uProgress.refresh()
Update the µProgress with and position based on its parent width. This methods is automatically called on a window `resize` event. However it has to be called manually if the parent container width changes for a reason other than a window resize.

**Kind**: instance method of [<code>UProgress</code>](#UProgress)  
**Example**  
Create a new µProgress on top of a modal and change it's width.
```javascript
const uProgress = new UProgress(document.getElementById('my-modal'));
// Modify the modal content (i.e. refresh content with Ajax)
changeModalContent();
uProgress.refresh();
```

{: .js.function.instance name="UProgress+destroy" data-menu-title="uProgress.destroy"}
## uProgress.destroy()
- Remove the µProgress from the DOM.
- Remove the `resize` event listener if this is the only non-destroyed instance.

**Kind**: instance method of [<code>UProgress</code>](#UProgress)  

{: .js.constant.static name="UProgress.Default" data-menu-title="UProgress.Default"}
## UProgress.Default : <code>Object</code>
The default options for all new µProgress instances.

**Kind**: static constant of [<code>UProgress</code>](#UProgress)  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| rtl | <code>boolean</code> | <code>false</code> | `true` to move the µProgress from right to left, `false` for left to right. |
| start | <code>number</code> | <code>0.01</code> | The position in percentage (.35 is 35%, 1 is 100%) at which the µProgress starts. |
| end | <code>number</code> | <code>0.99</code> | The position in percentage (.35 is 35%, 1 is 100%) the µProgress is moving toward when started. Once reached, it will stop until [set](#UProgress+set) or [done](#UProgress+done) are called. |
| duration | <code>number</code> | <code>2500</code> | The durarion in ms it takes for the µProgress to go from `start` to `end`. |
| doneDuration | <code>number</code> | <code>100</code> | The duration in ms that the µProgress take to complete when [done](#UProgress+done) is called. |
| fadeDuration | <code>number</code> | <code>200</code> | The duration in ms the µProgress takes to fade out after it has completed. |
| class | <code>number</code> | <code>&#x27;uprogress&#x27;</code> | The CSS class to set on the the µProgress element. |
| blurClass | <code>number</code> | <code>&#x27;blur&#x27;</code> | The CSS class to set on the the µProgress blur element. |
| barClass | <code>number</code> | <code>&#x27;bar&#x27;</code> | The CSS class to set on the the µProgress bar element. |
| resizeDebounce | <code>number</code> | <code>300</code> | the debounce threshold after which a window `resize` event trigger a call to [refresh](#UProgress+refresh). |

**Example**  
Change default options
```javascript
UProgress.Default.duration = 3000;
UProgress.Default.class = 'custom-uprogress';
```

{: .js.typedef.inner name="UProgress..Status" data-menu-title="UProgress~Status"}
## UProgress~Status : <code>Object</code>
Status of the µProgress instance.

**Kind**: inner typedef of [<code>UProgress</code>](#UProgress)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| target | <code>number</code> | The position in percentage (.35 is 35%, 1 is 100%) the µProgress is moving toward. Once reached, it will stop until [set](#UProgress+set) or [done](#UProgress+done) are called. |
| duration | <code>number</code> | The duration in ms left to reach the position `Status.target`. Only returned if the µProgress is started. |
| progress | <code>number</code> | The current progress in percentage (.35 is 35%, 1 is 100%). Only returned if the µProgress is started. |

