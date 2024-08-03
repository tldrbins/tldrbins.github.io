---
title: "LDAP"
date: 2024-7-9
tags: ["ldap", "active directory", "ad", "Windows", "nxc"]
---

---
### ldapsearch

```bash
# Using nmap script
sudo nmap -p 389 --script ldap-search 10.10.11.10
```

```bash
# Using ldapdomaindump (With Creds)
ldapdomaindump -u 'example.com\username' -p 'passowrd' 10.10.11.10 -o ./ldap
```

```bash
# Get domain base
ldapsearch -x -H ldap://10.10.11.10 -s base namingcontexts
```

```bash
# Get all from domain
ldapsearch -x -H ldap://10.10.11.10 -b 'DC=EXAMPLE,DC=COM'
```

```bash
# Just get a class (e.g. person)
ldapsearch -x -H ldap://10.10.11.10 -b 'DC=EXAMPLE,DC=COM' '(objectClass=person)'
```

```bash
# With creds (e.g. john.appleseed)
ldapsearch -x -H ldap://10.10.11.10 -D "CN=John Appleseed,CN=Users,DC=EXAMPLE,DC=COM" -w 'passowrd' -b 'DC=EXAMPLE,DC=COM'
```

#### With kerberos

```bash
# Add GSSAPI
sudo apt install libsasl2-modules-gssapi-mit
```

```bash
ldapsearch -H ldap://dc.example.com -Y GSSAPI -b "dc=example,dc=com"
```

### nxc

```bash
# With kerberos
nxc ldap 10.10.11.10 -u username -p 'password' -k --users
```

<br>