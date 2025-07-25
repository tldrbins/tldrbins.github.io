---
title: "POP3"
date: 2025-7-25
tags: ["Pop3", "Telnet", "Mail", "Email", "Enumeration"]
---

### General

```console
# Connect to POP3 mail server
telnet <TARGET> 110
```

```console
# Send cmd after +OK
USER <USER>
```

```console
PASS <PASSWORD>
```

```console
# List all mails
LIST
```

```console
# Retrieve mail #1
RETR 1
```

```console
# Exit Ctrl + ], then
quit
```
