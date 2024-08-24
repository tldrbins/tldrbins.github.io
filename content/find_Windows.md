---
title: "Find (Windows)"
date: 2024-7-10
tags: ["powershell", "find", "files", "Windows", "cmd"]
---

---
### Show hidden files

```powershell
Get-ChildItem -force
```

### Find a file

```powershell
ls -path \Users -Filter example.txt -recurse -erroraction silent
```

```powershell
where /R C:\Users example.txt
```

### Find a file, with rules

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

<br>
