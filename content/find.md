---
title: "Find"
date: 2024-6-29
tags: ["find", "linux", "file system", "enum"]
---

---
### Find and Open

```bash
find / -name test.txt -exec cat {} \;
```

### Find SUID bit set files

```bash
find / -type f -user root \( -perm -4000 -o -perm -2000 \) 2>/dev/null -ls
```

<br>