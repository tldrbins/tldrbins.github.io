---
title: "Alternate Data Stream"
date: 2024-7-10
tags: ["alternate Data Stream", "ads", "Windows", "cmd", "powershell"]
---

---
### Show ADS

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```powershell
# cmd
cmd /C dir /R \Windows\Tasks\example.txt
```

```powershell
# powershell
Get-Item -Path \Windows\Tasks\example.txt -force -stream *
```

</div>

{{< /tabcontent >}}

<br>
