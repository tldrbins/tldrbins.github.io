---
title: "RPC"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm", "impacket"]
---

---
### Remote Procedure Call

#### Tools

{{< tab set1 tab1 active >}}rpcclient{{< /tab >}}
{{< tab set1 tab2 >}}impacket{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Connect without creds
rpcclient -U '' -N 10.10.11.10
```

```bash
# Connect with creds
rpcclient -U <DOMAIN>/<USER>%<PASSWORD> 10.10.11.10
```

```bash
# Inline execute command
rpcclient -U <DOMAIN>/<USER>%<PASSWORD> 10.10.11.10 -c 'querydispinfo'
```

</div>

#### Basic Commands

<div>

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
querygroup <RID>
```

```bash
# Query group member by rid
querygroupmem <RID>
```

```bash
# Query user by rid
queryuser <RID>
```

```bash
# Look up a user
lookupnames <USER>
```

```bash
# Look up by SID
lookupsids <SID>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```bash
impacket-lookupsid <USER>:<PASSWORD>@<TARGET>
```

{{< /tabcontent >}}

<br>