---
title: "Volume Shadow Copies"
date: 2024-8-22
tags: ["Data Leakage", "Data Exfiltration", "Volume Shadow Copies", "Enumeration", "Windows", "VSC"]
---

### Abuse #1: Recover data from shadow copies

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Check

```console
vssadmin list shadows
```

#### 2. Create symlink and expose the volume

```console
cmd /c mklink /d C:\VSS <SHADOW_COPY_VOLUME_PATH>
```

#### 3. Access

```console
ls C:\VSS\Users
```

{{< /tabcontent >}}
