---
title: "LDAP"
date: 2024-7-9
tags: ["ldap", "active directory", "ad", "Windows"]
---

---
### Enum

```bash
# Using nmap script
sudo nmap -p 389 --script ldap-search 10.10.11.10
```

```bash
# Using ldapdomaindump (With Creds)
ldapdomaindump -u 'example.com\username' -p 'passowrd' 10.10.11.10 -o ./ldap
```

<br>