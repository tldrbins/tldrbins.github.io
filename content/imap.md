---
title: "IMAP"
date: 2024-7-9
tags: ["Imap", "Imaps", "Mail", "Email", "Openssl", "Enumeration"]
---

### IMAP/IMAPS

```console
# Connect to IMAP over ssl
rlwrap openssl s_client -connect <TARGET>:993
```

```console
# Login
a LOGIN <USER> <PASSWORD>
```

```console
# List all mailboxes
a LIST "" "*"
```

```console
# Select a mailbox (e.g. Inbox)
a SELECT INBOX
```

```console
# Get mail from mailbox (e.g. #1)
a FETCH 1 BODY.PEEK[]
```
