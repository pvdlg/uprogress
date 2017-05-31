---
layout: doc
title: Sass API
subtitle: Sass Mixins and variables
sidebar_class: sass
position: 3
anchor: true
heading: true
---

{% for item in site.data.sass %}
  {% if item.context.type == 'mixin' and item.context.scope != 'private' %}
{: .sass.mixin}
## {{ item.context.name }}
{{ item.description }}
    {% if item.output %}
**Output**:
{{ item.output }}
    {% endif %}
    {% if item.parameter and item.parameter.size > 0 %}
**Parameters**

| Name   | Description                       | Type        | Default Value     |
| ------ | --------------------------------- | ----------- | ----------------- |
      {% for param in item.parameter -%}
| {{param.name}}   | {{param.description}} | `{{param.type}}`      | {{param.default}}       |
      {% endfor %}
    {% endif %}
    {% if item.example and item.example.size > 0 %}
      {% if item.example.size == 1 %}
**Example**
      {% else %}
**Examples**
      {% endif %}
      {% for example in item.example %}
{{ example.description }}
{% highlight scss %}
{{ example.code }}
{% endhighlight %}
      {% endfor %}
    {% endif %}
  {% endif %}
{% endfor %}

{% for item in site.data.sass %}
  {% if item.context.type == 'variable' and item.context.scope != 'private' %}
{: .sass.variable}
## {{ item.context.name }}
{{ item.description }}
    {% if item.type %}
**Type**: `{{ item.type }}`
    {% endif %}
    {% if item.context.scope and item.context.value and item.context.scope == 'default' %}
**Default value**: `{{ item.context.value }}`
    {% endif %}
  {% endif %}
{% endfor %}
