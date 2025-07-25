---
title: "Find (Windows)"
date: 2025-7-25
tags: ["File Metadata", "Hidden Files", "File Attributes", "Find", "Files", "Windows"]
---

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Show Hidden Files

```console
# Show hidden files in current directory
Get-ChildItem -Force
```

```console
# Recusive
Get-ChildItem -Path '<PATH>' -Recurse -Force 2>$Null
```

### Find a File

```console
ls -path '<PATH>' -Filter '<FILE>' -recurse -erroraction silent
```

```console
where /R '<PATH>' '<FILE>'
```

```console
# Find files with wildcard
Get-ChildItem -Path '<PATH>' -Recurse -Force -Include '<PATTERN>' 2>$Null
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> Get-ChildItem -Path 'C:\' -Recurse -Force -Include 'flag.*' 2>$Null

    Directory: C:\Users\Administrator\Desktop

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        10/27/2017   4:02 PM             24 flag.txt

---[SNIP]---
```

### Find a File, with Rules

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

### Find a String Pattern

```console
# Show with file name
Get-ChildItem -Recurse -Force | Select-String -Pattern "FLAG\{.*\}" -AllMatches 2>$Null
```

```console
# Show only the value
Get-ChildItem -Recurse -Force | Select-String -Pattern "FLAG\{.*\}" -AllMatches 2>$Null | % { $_.Matches } | % { $_.Value }
```

### Find a Command Location

```console
where.exe <COMMAND>
```

```console {class="sample-code"}
PS C:\Program Files (x86)> where.exe sqlcmd
where.exe sqlcmd
C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\130\Tools\Binn\SQLCMD.EXE
```

{{< /tabcontent >}}
