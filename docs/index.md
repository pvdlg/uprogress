---
layout: base
---
<section class="hero container">
  <h1 class="title">
    <span class="logo-lg"></span>
    <span class="logo-text">{{ site.title }}</span>
  </h1>
  <h2 class="subtitle">{{ site.description }}</h2>
  <h4 class="subtitle">with animation fully running on GPU, freeing the main thread and allowing smooth progress</h4>
  <div class="hero-buttons">
    {% if jekyll.environment == "development" %}
      <a class="btn btn-primary" href="/getting-started">
        <span>Get started</span>
      </a>
    {% else %}
    <a class="btn btn-primary" href="{{ site.baseurl }}/getting-started">
      <span>Get started</span>
    </a>
  {% endif %}  
    <a class="btn btn-outline-primary" href="{{site.github.repository_url}}" rel="noopener" target="_blank">
      <span>Github</span>
    </a>
  </div>
</section>
<section class="hero-examples container">
  <div class="hero-buttons">
    <button id="index-start" class="btn btn-primary">
      {% octicon rocket height:18 %}
      <span>Start</span>
    </button>
    <button id="index-change-color" class="btn btn-primary">
      {% octicon paintcan height:18 %}
      <span>Change color</span>
    </button>
    <button id="index-done" class="btn btn-primary">
      {% octicon check height:18 %}
      <span>Done</span>
    </button>
  </div>
</section>
