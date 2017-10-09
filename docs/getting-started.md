---
layout: doc
title: Gettting Started
subtitle: Installation, build tools, compatibility, dependencies
position: 1
anchor: true
heading: true
---

# Installation

### In html page

Add uprogress.js and uprogress.css to your project.

```html
<script src='uprogress.js' />
<link rel='stylesheet' href='uprogress.css'/>
```
µProgress is available via [npm](https://www.npmjs.com/package/uprogress).

```bash
npm install uprogress
```

### With Sass and Javascript modules

```sass
@import 'uprogress';
```

```js
import UProgress from 'uprogress';
```

# Supported browsers

Total users coverage: **{{ site.data.browsers.coverage | round: 2}} %**

| Browser | Supported | Tested  |
| ------- | --------- | ------- |
{% for browser in site.data.browsers.browsers -%}
| {{ browser[0] }} | {% if browser[1].versions.size > 1 %}>= {% endif %} {{ browser[1].oldest }} | {% if browser[1].tested %}{{ browser[1].tested | join:'<br>' }}{% else %} - {% endif %} |
{% endfor %}

# Dependencies

| Library | Version | Module |
| ------- | ------- | ------ |
| [Mout](http://moutjs.com){:target="_blank"} | v1.1.0 |  [`function/debounce`](http://moutjs.com/docs/latest/function.html#debounce){:target="_blank" .highlighter} |
| [Mout](http://moutjs.com){:target="_blank"} | v1.1.0 |  [`math/clamp`](http://moutjs.com/docs/latest/math.html#clamp){:target="_blank" .highlighter} |
