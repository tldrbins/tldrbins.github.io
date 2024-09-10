---
title: "Scheduled tasks"
date: 2024-7-10
tags: ["scheduled tasks", "Windows", "enum"]
---

---
### Check scheduled tasks

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```powershell
schtasks /query
```

```powershell
# List details
schtasks /TN \Microsoft\Windows\<FOLDER>\<TASKNAME> /FO LIST /V
```

</div>

{{< /tabcontent >}}

<br>
