---
title: "Scheduled tasks"
date: 2024-7-10
tags: ["scheduled tasks", "Windows", "enum"]
---

---
### Check scheduled tasks

```powershell
schtasks /query
```

```powershell
# List details
schtasks /TN \Microsoft\Windows\<FOLDER>\<TASKNAME> /FO LIST /V
```

<br>
