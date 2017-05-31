---
layout: doc
title: Examples
position: 4
anchor: true
heading: true
---

# Default style

<div class="example">
  <button id="expl1-start" class="btn btn-primary">
    {% octicon rocket height:18 %}
    <span>Start</span>
  </button>
  <button id="expl1-done" class="btn btn-primary">
    {% octicon check height:18 %}
    <span>Done</span>
  </button>
</div>
{% highlight javascript %}
  const uProgress = new UProgress();
  
  document.getElementById('expl1-start').addEventListener('click', () => {
    uProgress.start();
  });
  
  document.getElementById('expl1-done').addEventListener('click', () => {
    uProgress.done();
  });
{% endhighlight %}

# Custom style

<div class="example-block">
<div class="example">
  <button id="expl2-start" class="btn btn-primary">
    {% octicon rocket height:18 %}
    <span>Start</span>
  </button>
  <button id="expl2-purple" class="btn btn-primary">
    {% octicon paintcan height:18 %}
    <span>uprogress-purple</span>
  </button>
  <button id="expl2-lg" class="btn btn-primary">
    {% octicon paintcan height:18 %}
    <span>uprogress-lg</span>
  </button>
  <button id="expl2-bottom" class="btn btn-primary">
    {% octicon paintcan height:18 %}
    <span>uprogress-bottom</span>
  </button>
  <button id="expl2-multi" class="btn btn-primary">
    {% octicon paintcan height:18 %}
    <span>uprogress-multi</span>
  </button>
  <button id="expl2-done" class="btn btn-primary">
    {% octicon check height:18 %}
    <span>Done</span>
  </button>
</div>
{% highlight scss %}
  @import 'uprogress/mixin';
  
  @include uprogress('uprogress-purple', 2px, #713ed0);
  @include uprogress('uprogress-lg', 8px);
  @include uprogress($name: 'uprogress-bottom', $position: 'bottom');
  @include uprogress('uprogress-multi', 5px, #17a0d3, #713ed0, #fc8d03, #17a0d3));
{% endhighlight %}
{% highlight javascript %}
  const uProgress = new UProgress({class : 'purple-progress'});
  
  document.getElementById('expl2-start').addEventListener('click', () => {
    uProgress.start({class: 'uprogress-purple'});
  });
  
  document.getElementById('expl2-purple').addEventListener('click', () => {
    uProgress.options({class: 'uprogress-purple'});
  });
  document.getElementById('expl2-lg').addEventListener('click', () => {
    uProgress.options({class: 'uprogress-lg'});
  });
  document.getElementById('expl2-bottom').addEventListener('click', () => {
    uProgress.options({class: 'uprogress-bottom'});
  });
  document.getElementById('expl2-multi').addEventListener('click', () => {
    uProgress.options({class: 'uprogress-multi'});
  });
  
  document.getElementById('expl2-done').addEventListener('click', () => {
    uProgress.done();
  });
{% endhighlight %}
</div>
# Right to left

<div class="example">
  <button id="expl3-start" class="btn btn-primary">
    {% octicon rocket height:18 %}
    <span>Start</span>
  </button>
  <button id="expl3-done" class="btn btn-primary">
    {% octicon check height:18 %}
    <span>Done</span>
  </button>
</div>
{% highlight javascript %}
  const uProgress = new UProgress({rtl: true});
  
  document.getElementById('expl1-start').addEventListener('click', () => {
    uProgress.start();
  });
  
  document.getElementById('expl1-done').addEventListener('click', () => {
    uProgress.done();
  });
{% endhighlight %}

# Within container

<div class="example">
  <div id="container-expl" class="modal">
  
  <button id="expl4-start" class="btn btn-primary">
    {% octicon rocket height:18 %}
    <span>Start</span>
  </button>
  <button id="expl4-done" class="btn btn-primary">
    {% octicon check height:18 %}
    <span>Done</span>
  </button>
  </div>
</div>
{% highlight javascript %}
  const uProgress = new UProgress(document.getElementById('container-expl'));
  
  document.getElementById('expl4-start').addEventListener('click', () => {
    uProgress.start();
  });
  
  document.getElementById('expl4-done').addEventListener('click', () => {
    uProgress.done();
  });
{% endhighlight %}
