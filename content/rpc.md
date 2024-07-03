---
title: "RPC"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm"]
---

---
### RPC

#### rpcclient

```bash
# Connect without creds
rpcclient -U '' -N 10.10.11.10
```

```bash
# Connect with creds
rpcclient -U domain/username 10.10.11.10
```

```bash
# Commands
querydispinfo
```

```bash
enumdomusers
```

<br>