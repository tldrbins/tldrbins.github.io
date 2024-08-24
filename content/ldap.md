---
title: "LDAP"
date: 2024-7-9
tags: ["ldap", "active directory", "ad", "Windows", "nxc"]
---

---
### Enum

```bash
# Using nmap script
sudo nmap -p 389 --script ldap-search <TARGET>
```

```bash
# Using ldapdomaindump (With Creds)
ldapdomaindump -u '<DOMAIN>\<USER>' -p <PASSWORD> <TARGET> -o ./ldap
```

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

### Enum with kerberos

```bash
# Add GSSAPI
sudo apt install libsasl2-modules-gssapi-mit
```

```bash
ldapsearch -H ldap://10.10.11.10 -Y GSSAPI -b 'DC=<EXAMPLE>,DC=<COM>'
```

#### nxc

```bash
# With kerberos
nxc ldap 10.10.11.10 -u <USER> -p <PASSWORD> -k --users
```

<br>