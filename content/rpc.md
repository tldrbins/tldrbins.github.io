---
title: "RPC"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm", "impacket"]
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
rpcclient -U domain/username%password 10.10.11.10
```

```bash
# Inline execute command
rpcclient -U domain/username%password 10.10.11.10 -c 'querydispinfo'
```

#### Basic Commands

```bash
# General info
querydispinfo
```

```bash
# List of users
enumdomusers
```

```bash
# List of groups
enumdomgroups
```

```bash
# Query group by rid
querygroup RID
```

```bash
# Query group member by rid
querygroupmem RID
```

```bash
# Query user by rid
queryuser RID
```

```bash
# Look up a user
lookupnames USERNAME
```

```bash
# Look up by SID
lookupsids SID
```

#### impacket-lookupsid

```bash
impacket-lookupsid username:password@10.10.11.10
```

<br>