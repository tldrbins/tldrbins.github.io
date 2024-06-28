---
title: "Steganography"
date: 2024-6-28
tags: ["steganography", "steg", "exiftool", "ctf"]
---

---
### exiftool

```bash
exiftool test.jpg
```

<br>

---

### steg

#### steghide

```bash
# Always try with empty passphrase
steghide extract -sf test.jpg
```

<br>