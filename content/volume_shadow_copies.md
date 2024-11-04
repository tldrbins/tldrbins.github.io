---
title: "Volume Shadow Copies"
date: 2024-8-22
tags: ["Data Leakage", "Data Exfiltration", "Volume Shadow Copies", "Enumeration", "Windows", "VSC"]
---

### Abuse #1: Recover data from shadow copies

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Check

```console
vssadmin list shadows
```

```console {class="sample-code"}
PS C:\Windows\system32> vssadmin list shadows
vssadmin list shadows
vssadmin 1.1 - Volume Shadow Copy Service administrative command-line tool
(C) Copyright 2001-2013 Microsoft Corp.

Contents of shadow copy set ID: {001689e5-f1a7-40a8-8b5b-8b6371bd07ca}
   Contained 1 shadow copies at creation time: 9/9/2019 3:10:57 AM
      Shadow Copy ID: {046396e4-6312-45b7-96cd-5e5f6fb017ef}
         Original Volume: (C:)\\?\Volume{21385651-0000-0000-0000-602200000000}\
         Shadow Copy Volume: \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1
         Originating Machine: dev.htb.local
         Service Machine: dev.htb.local
         Provider: 'Microsoft Software Shadow Copy provider 1.0'
         Type: ClientAccessible
         Attributes: Persistent, Client-accessible, No auto release, No writers, Differential
```

#### 2. Create symlink and expose the volume

```console
cmd /c mklink /d C:\VSS <SHADOW_COPY_VOLUME_PATH>
```

```console {class="sample-code"}
PS C:\Windows\system32> cmd /c mklink /d C:\VSS \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1
```

#### 3. Access

```console
ls C:\VSS\Users
```

{{< /tabcontent >}}
