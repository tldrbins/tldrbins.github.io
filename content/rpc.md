---
title: "RPC"
date: 2025-3-31
tags: ["Impacket", "Domain Controller", "Nxc", "Active Directory", "Windows", "Enumeration", "SID"]
---

### Remote Procedure Call

#### Tools

{{< tab set1 tab1 >}}rpcclient{{< /tab >}}
{{< tab set1 tab2 >}}impacket{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Anonymous
rpcclient -U '' -N <TARGET>
```

```console {class="sample-code"}
$ rpcclient -U '' -N 10.10.10.172
rpcclient $>
```

```console
# Password
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET>
```

```console
# NTLM
rpcclient -U '<DOMAIN>/<USER>%<HASH>' --pw-nt-hash <TARGET>
```

```console
# Inline Execute Command
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET> -c 'querydispinfo'
```

#### Basic Commands

```console
# General info
querydispinfo
```

```console {class="sample-code"}
rpcclient $> querydispinfo
index: 0xfb6 RID: 0x450 acb: 0x00000210 Account: AAD_987d7f2f57d2       Name: AAD_987d7f2f57d2  Desc: Service account for the Synchronization Service with installation identifier 05c97990-7587-4a3d-b312-309adfc172d9 running on computer MONTEVERDE.
index: 0xfd0 RID: 0xa35 acb: 0x00000210 Account: dgalanos       Name: Dimitris Galanos  Desc: (null)
index: 0xedb RID: 0x1f5 acb: 0x00000215 Account: Guest  Name: (null)    Desc: Built-in account for guest access to the computer/domain
index: 0xfc3 RID: 0x641 acb: 0x00000210 Account: mhope  Name: Mike Hope Desc: (null)
index: 0xfd1 RID: 0xa36 acb: 0x00000210 Account: roleary        Name: Ray O'Leary       Desc: (null)
...[SNIP]....
```

```console
# List of users
enumdomusers
```

```console {class="sample-code"}
rpcclient $> enumdomusers
user:[Guest] rid:[0x1f5]
user:[AAD_987d7f2f57d2] rid:[0x450]
user:[mhope] rid:[0x641]
user:[SABatchJobs] rid:[0xa2a]
user:[svc-ata] rid:[0xa2b]
...[SNIP]....
```

```console
# List of groups
enumdomgroups
```

```console {class="sample-code"}
rpcclient $> enumdomgroups
group:[Enterprise Read-only Domain Controllers] rid:[0x1f2]
group:[Domain Users] rid:[0x201]
group:[Domain Guests] rid:[0x202]
group:[Domain Computers] rid:[0x203]
group:[Group Policy Creator Owners] rid:[0x208]
...[SNIP]....
```

```console
# Query group by rid
querygroup <RID>
```

```console {class="sample-code"}
rpcclient $> querygroup 0x201
        Group Name:     Domain Users
        Description:    All domain users
        Group Attribute:7
        Num Members:11
```

```console
# Query group member by rid
querygroupmem <RID>
```

```console {class="sample-code"}
rpcclient $> querygroupmem 0x201
        rid:[0x1f4] attr:[0x7]
        rid:[0x1f6] attr:[0x7]
        rid:[0x450] attr:[0x7]
        rid:[0x641] attr:[0x7]
        rid:[0xa2a] attr:[0x7]
...[SNIP]....
```

```console
# Query user by rid
queryuser <RID>
```

```console {class="sample-code"}
rpcclient $> queryuser 0x641
        User Name   :   mhope
        Full Name   :   Mike Hope
        Home Drive  :   \\monteverde\users$\mhope
        Dir Drive   :   H:
        Profile Path:
...[SNIP]....
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
