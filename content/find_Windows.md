---
title: "Find (Windows)"
date: 2024-7-10
tags: ["powershell", "find", "files", "Windows", "cmd"]
---

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Show hidden files

```console
Get-ChildItem -force
```

### Find a file

```console
ls -path <PATH> -Filter <FILE> -recurse -erroraction silent
```

```console
where /R <PATH> <FILE>
```

### Find a file, with rules

```console
dir /s /b /a:-d-h <PATH> | findstr /i /v '<STRING>'
```

```console
+---------------------------------------+
|dir:                                   |
|/s      : include subfolders           |
|/b      : bare format                  |
|/a:-d-h : exclude directories or hidden|
|                                       |
|findstr:                               |
|/i          : case insensitive         |
|/v STRING   : exclude STRING           |
+---------------------------------------+
```

{{< /tabcontent >}}
