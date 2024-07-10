---
title: "Alternate Data Stream"
date: 2024-7-10
tags: ["alternate Data Stream", "ads", "Windows", "cmd", "powershell"]
---

---
### Show ADS

```powershell
# cmd
cmd /C dir /R \windows\tasks\file.txt
```

```powershell
Get-Item -Path \windows\tasks\file.txt -force -stream *
```

<br>
