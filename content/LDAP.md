---
title: "LDAP"
date: 2025-7-23
tags: ["Kerberos", "Ldap", "Nmap", "Ldap Search", "Enumeration", "Active Directory", "Windows", "Nxc", "ldapmodify", "ldif", "Permissions"]
---

### Enum

{{< tab set1 tab1 >}}ldapsearch{{< /tab >}}
{{< tab set1 tab2 >}}ldapdomaindump{{< /tab >}}
{{< tab set1 tab3 >}}nmap{{< /tab >}}
{{< tabcontent set1 tab1 >}}

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

```console
# Fix 'BindSimple: Transport encryption required.'
LDAPTLS_REQCERT=never ldapsearch -x -H ldaps://<TARGET> -D "CN=<USER>,CN=Users,DC=<EXAMPLE>,DC=<COM>" -w '<PASSWORD>' -b 'DC=<EXAMPLE>,DC=<COM>'
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# With creds
ldapdomaindump -u '<DOMAIN>\<USER>' -p '<PASSWORD>' <TARGET> -o ./ldap
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
# Using nmap script
sudo nmap -p 389 --script ldap-search <TARGET>
```

{{< /tabcontent >}}

### Enum with Kerberos

{{< tab set2 tab1 >}}ldapsearch{{< /tab >}}
{{< tab set2 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Add GSSAPI
sudo apt install libsasl2-modules-gssapi-mit
```

```console
ldapsearch -H ldap://<TARGET> -Y GSSAPI -b 'DC=<EXAMPLE>,DC=<COM>'
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# With kerberos
nxc ldap <TARGET> -u <USER> -p '<PASSWORD>' -k --users
```

{{< /tabcontent >}}

### Enum ACLs

{{< tab set3 tab1 >}}bloodyAD{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Request a TGT

```console
# Password
sudo ntpdate -s <DC_IP> && impacket-getTGT '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

```console
# NTLM
sudo ntpdate -s <DC_IP> && impacket-getTGT '<DOMAIN>/<USER>' -hashes :<HASH> -dc-ip <DC_IP>
```

```console
export KRB5CCNAME='<USER>.ccache'
```

#### 2. Enum ACLs

```console
bloodyAD -d <DOMAIN> -k --host <DC> get writable --detail
```

{{< /tabcontent >}}

### Modify Entries

#### 1. Create a LDIF File

```console
dn: <DN>
changetype: modify
replace: <KEY>
<KEY>: <VALUE>
-
add: <KEY_1>
<KEY_1>: <VALUE_1>
```

```console {class="sample-code"}
dn: cn=John Doe,ou=People,dc=example,dc=com
changetype: modify
replace: logonHours
logonHours:: ////////////////////////////
-
```

#### 2. Modify Entries

```console
ldapmodify -x -D '<USER>@<DOMAIN>' -w '<PASSWORD>' -H ldap://<TARGET> -f <LDIF_FILE>
```

```console {class="sample-code"}
$ ldapmodify -x -D 'john.doe@example.com' -w 'password1' -H ldap://DC01.EXAMPLE.COM -f set_logonhours.ldif
modifying entry "CN=John Doe,OU=People,DC=example,DC=com"
```