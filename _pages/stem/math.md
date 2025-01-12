---
title: "Mathematics"
layout: category
permalink: /stem/math/
categories: [stem, math]
author_profile: true
sidebar:
  nav: "sidebar-category"
  enabled: true
---

{: .notice--warning}
아는 척 하기 괜찮은 잡다한 지식

---

{% assign posts_with_stem = site.posts | where: "categories", "stem" %}
{% assign posts_with_stem_and_math = posts_with_stem | where: "categories", "math" %}

{% assign sorted_posts = posts_with_stem_and_math | sort: "date" | reverse %}

{% for post in sorted_posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}