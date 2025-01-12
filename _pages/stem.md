---
title: "STEM"
layout: category
permalink: /stem/
categories: [stem]
author_profile: true
sidebar:
  nav: "sidebar-category"
  enabled: true
---

{: .notice--warning}
Science, Technology, Engineering, and Mathematics

---
{% assign posts_with_stem = site.posts | where: "categories", "stem" %}

{% assign sorted_posts = posts_with_stem | sort: "date" | reverse %}

{% for post in sorted_posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}