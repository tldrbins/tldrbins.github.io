---
title: "Alternate Data Stream"
date: 2024-7-10
tags: ["alternate Data Stream", "ads", "Windows", "cmd", "powershell"]
---

---
### Show ADS

```powershell
# cmd
cmd /C dir /R \Windows\Tasks\example.txt
```

```powershell
# powershell
Get-Item -Path \Windows\Tasks\example.txt -force -stream *
```

<br>
