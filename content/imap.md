---
title: "IMAP"
date: 2024-7-9
tags: ["imap", "imaps", "mail", "email", "openssl"]
---

---
### IMAP/IMAPS

<div>

```bash
# Connect to IMAP over ssl
rlwrap openssl s_client -connect 10.10.11.10:993
```

```bash
# Login
a LOGIN <USER> <PASSWORD>
```

```bash
# List all mailboxes
a LIST "" "*"
```

```bash
# Select a mailbox (e.g. Inbox)
a SELECT INBOX
```

```bash
# Get mail from mailbox (e.g. #1)
a FETCH 1 BODY.PEEK[]
```

</div>

<br>