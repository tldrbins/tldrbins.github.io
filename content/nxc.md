---
title: "NetExec (nxc)"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm", "rid"]
---

---
#### Basic Commands

<div>

```bash
# Single user and password
nxc smb 10.10.11.10 -u <USER> -p <PASSWORD>
```

```bash
# Single user and password (Active Directory)
nxc smb -u <USER> -p <PASSWORD> -d <DOMAIN> -dc-ip <DC_IP>
```

```bash
# Multiple users or passwords
nxc smb -u usernames.txt -p <PASSWORD> -d <DOMAIN> -dc-ip <DC_IP> --continue-on-success
```

```bash
# Match username to corresponding password
nxc smb 10.10.11.10 -u usernames.txt -p passwords.txt --no-bruteforce --continue-on-success
```

```bash
# With LM Hash:NT Hash
nxc smb 10.10.11.10 -u <USER> -H <LM>:<NT>
```

```bash
# With Kerberos, or STATUS_ACCOUNT_RESTRICTION (NTLM disabled)
nxc smb -u <USER> -p <PASSWORD> -d <DOMAIN> -k 10.10.11.10
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

```bash
nxc smb 10.10.11.10 -u guest -p '' --rid-brute 10000
```

</div>

#### User Enum (Authenticated)

<div>

```bash
nxc smb 10.10.11.10 -u <USER> -p <PASSWORD> -d <DOMAIN> --users
```

</div>

<small>*Ref: [Download nxc](https://github.com/Pennyw0rth/NetExec)*</small>

<br>