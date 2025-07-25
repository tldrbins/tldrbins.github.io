---
title: "Joomla"
date: 2024-7-8
tags: ["Joomla", "Cms", "Web Exploitation"]
---

### Check Version

```console
curl -s <TARGET>/administrator/manifests/files/joomla.xml | head
```

---

### Admin Panel

```console
curl -s <TARGET>/administrator
```
