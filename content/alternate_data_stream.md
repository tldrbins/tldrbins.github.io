---
title: "Alternate Data Stream"
date: 2024-7-10
tags: ["File Metadata", "Alternate Data Stream", "ADS", "Windows", "Hidden Files"]
---

### Show ADS

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# cmd
cmd /C dir /R <FILE_PATH>
```

```console
# powershell
Get-Item -Path <FILE_PATH> -force -stream *
```

{{< /tabcontent >}}
