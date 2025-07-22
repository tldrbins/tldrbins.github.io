---
title: "NetExec (nxc)"
date: 2024-7-2
tags: ["Ldap", "Crackmapexec", "Rid", "Brute Force", "Smb", "Ldap Search", "Enumeration", "Domain Controller", "Nxc", "Active Directory", "Windows", "Winrm"]
---

#### Basic Commands

{{< tab set1 tab1 >}}Password{{< /tab >}}
{{< tab set1 tab2 >}}NTLM{{< /tab >}}
{{< tab set1 tab3 >}}Kerberos{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Single User, Single Password
nxc <PROTOCOL> <TARGET> -u '<USER>' -p '<PASSWORD>'
```

```console
# Single User, Single Password, Local Auth
nxc <PROTOCOL> <TARGET> -u '<USER>' -p '<PASSWORD>' --local-auth
```

```console
# Single User, Single Password (Active Directory)
nxc <PROTOCOL> <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN>
```

```console
# Single User, Multiple Passwords
nxc <PROTOCOL> <TARGET> -u '<USER>' -p <PASSWORDS> -d <DOMAIN>
```

```console
# Multiple Users, Single Password
nxc <PROTOCOL> <TARGET> -u <USERS> -p '<PASSWORD>' -d <DOMAIN> --continue-on-success
```

```console
# Multiple Users, Multiple Passwords
nxc <PROTOCOL> <TARGET> -u <USERS> -p <PASSWORDS> -d <DOMAIN> --continue-on-success
```

```console
# Match Username to Corresponding Password
nxc <PROTOCOL> <TARGET> -u <USERS> -p <PASSWORDS> --no-bruteforce --continue-on-success
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
nxc <PROTOCOL> <TARGET> -u '<USER>' -H <HASH>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
# With Kerberos, or STATUS_ACCOUNT_RESTRICTION (NTLM disabled)
sudo ntpdate -s <DC_IP> && nxc <PROTOCOL> <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> -k
```

```console
# With Kerberos ccache, or STATUS_NOT_SUPPORTED (NTLM disabled)
sudo ntpdate -s <DC_IP> && nxc <PROTOCOL> <TARGET> -u '<USER>' -d <DOMAIN> -k --use-kcache
```

{{< /tabcontent >}}

<small>*Hint: We can also run on multiple targets*</small>

#### Supported Protocols

```
+----------------------------------------------------------+
| ftp | ldap | mssql | rdp | smb | ssh | vnc | winrm | wmi |
+----------------------------------------------------------+
```

<br>

---

#### Users Enum

{{< tab set2 tab1 >}}Authenticated{{< /tab >}}
{{< tab set2 tab2 >}}Brute-Force{{< /tab >}}
{{< tabcontent set2 tab1 >}}
{{< tab set2-1 tab1 active >}}Password{{< /tab >}}{{< tab set2-1 tab2 >}}NTLM{{< /tab >}}{{< tab set2-1 tab3 >}}Kerberos{{< /tab >}}
{{< tabcontent set2-1 tab1 >}}

```console
nxc smb <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> --users
```

{{< /tabcontent >}}
{{< tabcontent set2-1 tab2 >}}

```console
nxc smb <TARGET> -u '<USER>' -H <HASH> --users
```

{{< /tabcontent >}}
{{< tabcontent set2-1 tab3 >}}

```console
nxc smb <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> -k --users
```

```console
nxc smb <TARGET> -u '<USER>' -d <DOMAIN> -k --use-kcache --users
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
nxc smb <TARGET> -u guest -p '' --rid-brute 10000
```

{{< /tabcontent >}}
{{< /tabcontent >}}

<small>*Ref: [nxc](https://github.com/Pennyw0rth/NetExec)*</small>
