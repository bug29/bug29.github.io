---
title: "계산기 만들기"
layout: category
parent: javascript
permalink: /javascript/calculator/
categories: [javascript, calculator]
author_profile: true
sidebar:
  nav: "sidebar-category"
  enabled: true
---

{: .notice--warning}
jquery를 이용하여 사칙연산 전용 계산기를 만들어 봅시다.

---

{% assign posts_with_javascript = site.posts | where: "categories", "javascript" %}
{% assign posts_with_javascript_and_calculator = posts_with_javascript | where: "categories", "calculator" %}

{% assign sorted_posts = posts_with_javascript_and_calculator | sort: "date" %}

{% for post in sorted_posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}