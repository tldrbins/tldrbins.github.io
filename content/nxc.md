---
title: "NetExec (nxc)"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm", "rid"]
---

#### Basic Commands

<div>

```console
# Single user and password
nxc smb <TARGET> -u <USER> -p '<PASSWORD>'
```

```console
# Single user and password (Active Directory)
nxc smb -u <USER> -p '<PASSWORD>' -d <DOMAIN> <TARGET>
```

```console
# Multiple users or passwords
nxc smb -u <USERNAMES> -p '<PASSWORD>' -d <DOMAIN> <TARGET> --continue-on-success
```

```console
# Match username to corresponding password
nxc smb <TARGET> -u <USERNAMES> -p <PASSWORDS> --no-bruteforce --continue-on-success
```

```console
# With LM Hash:NT Hash
nxc smb <TARGET> -u <USER> -H <LM>:<NT>
```

```console
# With Kerberos, or STATUS_ACCOUNT_RESTRICTION (NTLM disabled)
nxc smb -u <USER> -p '<PASSWORD>' -d <DOMAIN> -k <TARGET>
```

</div>

#### Supported protocols

<div>

```
+----------------------------------------------------------+
| ftp | ldap | mssql | rdp | smb | ssh | vnc | winrm | wmi |
+----------------------------------------------------------+
```

</div>

#### RID Brute

<div>

```console
nxc smb <TARGET> -u guest -p '' --rid-brute 10000
```

</div>

#### User Enum (Authenticated)

<div>

```console
nxc smb <TARGET> -u <USER> -p '<PASSWORD>' -d <DOMAIN> --users
```

</div>

<small>*Ref: [Download nxc](https://github.com/Pennyw0rth/NetExec)*</small>

<br>