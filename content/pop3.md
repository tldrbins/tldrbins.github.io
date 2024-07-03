---
title: "POP3"
date: 2024-7-2
tags: ["pop3", "telnet", "mail", "email"]
---

---
### POP3

```bash
# Connect to POP3 mail server
telnet 10.10.11.10 110

# Send cmd after +OK
USER user
PASS password

# List all mails
LIST

# Retrieve mail #1
RETR 1

# Exit Ctrl + ], then
quit
```

<br>