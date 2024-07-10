---
title: "Find (Windows)"
date: 2024-7-10
tags: ["powershell", "find", "files", "Windows", "cmd"]
---

---
### Find a file

```powershell
ls -path \Users -Filter file.txt -recurse -erroraction silent
```

```powershell
where /R C:\Users file.txt
```

### Find a file, with rule

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

### Show hidden files

```powershell
Get-ChildItem -force
```

<br>
