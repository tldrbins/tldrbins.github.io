---
title: "NetExec (nxc)"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm", "rid"]
---

---
### nxc

[Download nxc](https://github.com/Pennyw0rth/NetExec)

#### Basic Commands

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
# Match username to corresponding password
nxc smb 10.10.11.10 -u usernames.txt -p passwords.txt --no-bruteforce --continue-on-success
```

```bash
# With LM Hash:NT Hash
nxc smb 10.10.11.10 -u username -H LM_hash:NT_hash
```

```bash
# With Kerberos, or STATUS_ACCOUNT_RESTRICTION (NTLM disabled)
nxc smb -u username -p password -d domain -dc-ip 10.10.11.10 -k
```

#### Supported protocols

```
+----------------------------------------------------------+
| ftp | ldap | mssql | rdp | smb | ssh | vnc | winrm | wmi |
+----------------------------------------------------------+
```

#### RID Brute

```bash
nxc smb 10.10.11.10 -u guest -p '' --rid-brute 10000
```

#### User Enum (Authenticated)

```bash
nxc smb 10.10.11.10 -u username -p password -d example.com --users
```

<br>