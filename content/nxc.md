---
title: "NetExec (nxc)"
date: 2024-7-2
tags: ["Ldap", "Crackmapexec", "Rid", "Brute Force", "Smb", "Ldap Search", "Enumeration", "Domain Controller", "Nxc", "Active Directory", "Windows", "Winrm"]
---

#### Basic Commands

```console
# Single user, single password
nxc <PROTOCOL> <TARGET> -u '<USER>' -p '<PASSWORD>'
```

```console
# Single user, single password, local auth
nxc <PROTOCOL> <TARGET> -u '<USER>' -p '<PASSWORD>' --local-auth
```

```console
# Single user, single password (Active Directory)
nxc <PROTOCOL> <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN>
```

```console
# Single user, multiple passwords
nxc <PROTOCOL> <TARGET> -u '<USER>' -p <PASSWORDS> -d <DOMAIN>
```

```console
# Multiple users, single password
nxc <PROTOCOL> <TARGET> -u <USERNAMES> -p '<PASSWORD>' -d <DOMAIN> --continue-on-success
```

```console
# Multiple users, multiple passwords
nxc <PROTOCOL> <TARGET> -u <USERNAMES> -p <PASSWORDS> -d <DOMAIN> --continue-on-success
```

```console
# Match username to corresponding password
nxc <PROTOCOL> <TARGET> -u <USERNAMES> -p <PASSWORDS> --no-bruteforce --continue-on-success
```

```console
# With hash
nxc <PROTOCOL> <TARGET> -u '<USER>' -H <HASH>
```

```console
# With Kerberos, or STATUS_ACCOUNT_RESTRICTION (NTLM disabled)
nxc <PROTOCOL> <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> -k
```

```console
# With Kerberos ccache, or STATUS_NOT_SUPPORTED (NTLM disabled)
nxc <PROTOCOL> <TARGET> -u '<USER>' -d <DOMAIN> -k --use-kcache
```

<small>*Hint: we can also run on multiple targets*</small>

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
nxc smb <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> --users
```

<small>*Ref: [Download nxc](https://github.com/Pennyw0rth/NetExec)*</small>
