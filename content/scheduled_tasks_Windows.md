---
title: "Scheduled tasks"
date: 2024-7-10
tags: ["Enumeration", "Scheduled Tasks", "Windows", "Enum"]
---

### Check scheduled tasks

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
schtasks /query
```

```console
# List details
schtasks /TN \Microsoft\Windows\<FOLDER>\<TASKNAME> /FO LIST /V
```

{{< /tabcontent >}}
