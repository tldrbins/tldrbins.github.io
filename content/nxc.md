---
title: "NetExec (nxc)"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm"]
---

---
### nxc

[Download nxc](https://github.com/Pennyw0rth/NetExec)

#### SMB

```bash
# Single user and password
nxc smb 10.10.11.10 -u username -p password
```

```bash
# Single user and password (Active Directory)
nxc smb -u username -p password -d domain -dc-ip 10.10.11.10
```

```bash
# Multiple users or passwords
nxc smb -u usernames.txt -p password -d domain -dc-ip 10.10.11.10 --continue-on-success
```

```bash
# With LM Hash:NT Hash
nxc smb 10.10.11.10 -u username -H LM_hash:NT_hash
```

#### WINRM

```bash
# Single user and password
nxc winrm 10.10.11.10 -u username -p password
```

<br>