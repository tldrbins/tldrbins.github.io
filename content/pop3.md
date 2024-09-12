---
title: "POP3"
date: 2024-7-2
tags: ["pop3", "telnet", "mail", "email"]
---

### Basic

<div>

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

</div>

<br>