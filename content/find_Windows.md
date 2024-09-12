---
title: "Find (Windows)"
date: 2024-7-10
tags: ["powershell", "find", "files", "Windows", "cmd"]
---

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Show hidden files

<div>

```console
Get-ChildItem -force
```

</div>

### Find a file

<div>

```console
ls -path <PATH> -Filter <FILE> -recurse -erroraction silent
```

```console
where /R <PATH> <FILE>
```

</div>

### Find a file, with rules

<div>

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

</div>

{{< /tabcontent >}}

<br>
