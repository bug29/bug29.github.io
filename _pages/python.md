---
title: "PYTHON"
layout: category
permalink: /python/
categories: [python]
author_profile: true
sidebar:
  nav: "sidebar-category"
  enabled: true
---

{: .notice--warning}
python으로 코딩하기

---
{% assign posts_with_python = site.posts | where: "categories", "python" %}

{% assign sorted_posts = posts_with_python | sort: "date" | reverse %}

{% for post in sorted_posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}