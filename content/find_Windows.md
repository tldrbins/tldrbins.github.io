---
title: "Find (Windows)"
date: 2024-7-10
tags: ["powershell", "find", "files", "Windows", "cmd"]
---

---
{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Show hidden files

<div>

```powershell
Get-ChildItem -force
```

</div>

### Find a file

<div>

```powershell
ls -path \Users -Filter example.txt -recurse -erroraction silent
```

```powershell
where /R C:\Users example.txt
```

</div>

### Find a file, with rules

<div>

```powershell
dir /s /b /a:-d-h \Users\Administrator | findstr /i /v "appdata"
```

```
+---------------------------------------+
|dir:                                   |
|/s      : include subfolders           |
|/b      : bare format                  |
|/a:-d-h : exclude directories or hidden|
|                                       |
|findstr:                               |
|/i         : case insensitive          |
|/v appdata : exclude 'appdata'         |
+---------------------------------------+
```

</div>

{{< /tabcontent >}}

<br>
