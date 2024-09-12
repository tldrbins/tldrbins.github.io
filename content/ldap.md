---
title: "LDAP"
date: 2024-7-9
tags: ["ldap", "active directory", "ad", "Windows", "nxc"]
---

### Enum

{{< tab set1 tab1 active >}}nmap{{< /tab >}}
{{< tab set1 tab2 >}}ldapdomaindump{{< /tab >}}
{{< tab set1 tab3 >}}ldapsearch{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Using nmap script
sudo nmap -p 389 --script ldap-search <TARGET>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# Using ldapdomaindump (With Creds)
ldapdomaindump -u '<DOMAIN>\<USER>' -p '<PASSWORD>' <TARGET> -o ./ldap
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```console
# Get domain base
ldapsearch -x -H ldap://<TARGET> -s base namingcontexts
```

```console
# Get all from domain
ldapsearch -x -H ldap://<TARGET> -b 'DC=<EXAMPLE>,DC=<COM>'
```

```console
# Just get a class (e.g. person)
ldapsearch -x -H ldap://<TARGET> -b 'DC=<EXAMPLE>,DC=<COM>' '(objectClass=person)'
```

```console
# With creds
ldapsearch -x -H ldap://<TARGET> -D "CN=<USER>,CN=Users,DC=<EXAMPLE>,DC=<COM>" -w '<PASSWORD>' -b 'DC=<EXAMPLE>,DC=<COM>'
```

</div>

{{< /tabcontent >}}

### Enum with Kerberos

{{< tab set2 tab1 active >}}ldapsearch{{< /tab >}}
{{< tab set2 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```console
# Add GSSAPI
sudo apt install libsasl2-modules-gssapi-mit
```

```console
ldapsearch -H ldap://<TARGET> -Y GSSAPI -b 'DC=<EXAMPLE>,DC=<COM>'
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```console
# With kerberos
nxc ldap <TARGET> -u <USER> -p '<PASSWORD>' -k --users
```

</div>

{{< /tabcontent >}}

<br>