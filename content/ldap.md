---
title: "LDAP"
date: 2024-7-9
tags: ["ldap", "active directory", "ad", "Windows", "nxc"]
---

---
### Enum

{{< tab set1 tab1 active >}}nmap{{< /tab >}}
{{< tab set1 tab2 >}}ldapdomaindump{{< /tab >}}
{{< tab set1 tab3 >}}ldapsearch{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Using nmap script
sudo nmap -p 389 --script ldap-search <TARGET>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Using ldapdomaindump (With Creds)
ldapdomaindump -u '<DOMAIN>\<USER>' -p <PASSWORD> <TARGET> -o ./ldap
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
# Get domain base
ldapsearch -x -H ldap://10.10.11.10 -s base namingcontexts
```

```bash
# Get all from domain
ldapsearch -x -H ldap://10.10.11.10 -b 'DC=<EXAMPLE>,DC=<COM>'
```

```bash
# Just get a class (e.g. person)
ldapsearch -x -H ldap://10.10.11.10 -b 'DC=<EXAMPLE>,DC=<COM>' '(objectClass=person)'
```

```bash
# With creds (e.g. john.appleseed)
ldapsearch -x -H ldap://10.10.11.10 -D "CN=John Appleseed,CN=Users,DC=<EXAMPLE>,DC=<COM>" -w <PASSWORD> -b 'DC=<EXAMPLE>,DC=<COM>'
```

</div>

{{< /tabcontent >}}

### Enum with Kerberos

{{< tab set2 tab1 active >}}ldapsearch{{< /tab >}}
{{< tab set2 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```bash
# Add GSSAPI
sudo apt install libsasl2-modules-gssapi-mit
```

```bash
ldapsearch -H ldap://10.10.11.10 -Y GSSAPI -b 'DC=<EXAMPLE>,DC=<COM>'
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```bash
# With kerberos
nxc ldap 10.10.11.10 -u <USER> -p <PASSWORD> -k --users
```

</div>

{{< /tabcontent >}}

<br>