---
title: "Alternate Data Stream"
date: 2024-7-10
tags: ["alternate Data Stream", "ads", "Windows", "cmd", "powershell"]
---

### Show ADS

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# cmd
cmd /C dir /R <FILE_PATH>
```

```console
# powershell
Get-Item -Path <FILE_PATH> -force -stream *
```

</div>

{{< /tabcontent >}}

<br>
