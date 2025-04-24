---
title: "엑셀 데이터 변환기"
layout: category
parent: python
permalink: /python/xlsxToJson/
categories: [python, json]
author_profile: true
sidebar:
  nav: "sidebar-category"
  enabled: true
---

{: .notice--warning}
.xlsx 포맷의 스프래드시트를 .json으로 변환합니다.

---

{% assign posts_with_python = site.posts | where: "categories", "python" %}
{% assign posts_with_python_and_json = posts_with_python | where: "categories", "json" %}

{% assign sorted_posts = posts_with_python_and_json | sort: "date" %}

{% for post in sorted_posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}