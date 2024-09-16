---
title: "RPC"
date: 2024-7-2
tags: ["nxc", "crackmapexec", "active directory", "ad", "domain controller", "Windows", "smb", "ldap", "winrm", "impacket"]
---

### Remote Procedure Call

#### Tools

{{< tab set1 tab1 active >}}rpcclient{{< /tab >}}
{{< tab set1 tab2 >}}impacket{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Connect without creds
rpcclient -U '' -N <TARGET>
```

```console
# Connect with creds
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET>
```

```console
# Inline execute command
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET> -c 'querydispinfo'
```

#### Basic Commands

```console
# General info
querydispinfo
```

```console
# List of users
enumdomusers
```

```console
# List of groups
enumdomgroups
```

```console
# Query group by rid
querygroup <RID>
```

```console
# Query group member by rid
querygroupmem <RID>
```

```console
# Query user by rid
queryuser <RID>
```

```console
# Look up a user
lookupnames <USER>
```

```console
# Look up by SID
lookupsids <SID>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
impacket-lookupsid '<USER>:<PASSWORD>@<TARGET>'
```

{{< /tabcontent >}}
