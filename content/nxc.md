---
title: "NetExec (nxc)"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm", "rid"]
---

#### Basic Commands

```console
# Single user and password
nxc <PROTOCOL> <TARGET> -u <USER> -p '<PASSWORD>'
```

```console
# Single user and password (Active Directory)
nxc <PROTOCOL> -u <USER> -p '<PASSWORD>' -d <DOMAIN> <TARGET>
```

```console
# Multiple users or passwords
nxc <PROTOCOL> -u <USERNAMES> -p '<PASSWORD>' -d <DOMAIN> <TARGET> --continue-on-success
```

```console
# Match username to corresponding password
nxc <PROTOCOL> <TARGET> -u <USERNAMES> -p <PASSWORDS> --no-bruteforce --continue-on-success
```

```console
# With hash
nxc <PROTOCOL> <TARGET> -u <USER> -H <LM>:<NT>
```

```console
# With Kerberos, or STATUS_ACCOUNT_RESTRICTION (NTLM disabled)
nxc <PROTOCOL> -u <USER> -p '<PASSWORD>' -d <DOMAIN> -k <TARGET>
```

#### Supported protocols

```
+----------------------------------------------------------+
| ftp | ldap | mssql | rdp | smb | ssh | vnc | winrm | wmi |
+----------------------------------------------------------+
```

#### RID Brute

```console
nxc smb <TARGET> -u guest -p '' --rid-brute 10000
```

#### User Enum (Authenticated)

```console
nxc smb <TARGET> -u <USER> -p '<PASSWORD>' -d <DOMAIN> --users
```

<small>*Ref: [Download nxc](https://github.com/Pennyw0rth/NetExec)*</small>
