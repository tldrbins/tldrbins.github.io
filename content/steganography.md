---
title: "Steganography"
date: 2024-6-28
tags: ["steganography", "steg", "exiftool", "ctf"]
---

### Tools

{{< tab set1 tab1 active >}}exiftool{{< /tab >}}
{{< tab set1 tab2 >}}steghide{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
exiftool <FILE>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Always try with empty passphrase
steghide extract -sf <FILE>
```

{{< /tabcontent >}}
