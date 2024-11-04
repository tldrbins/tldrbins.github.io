---
title: "Windows ACLs"
date: 2024-6-28
tags: ["Acls", "Icacls", "Windows", "Access Control Lists", "Files"]
---

### Window ACLs (Access Control Lists)

#### Check ACLs

{{< tab set1 tab1 >}}powershell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Check a file/directory
icacls <PATH>
```

```console {class="sample-code"}
PS C:\xampp\htdocs\internal> icacls C:\xampp\htdocs\internal\applications
icacls C:\xampp\htdocs\internal\applications
C:\xampp\htdocs\internal\applications CREATOR OWNER:(OI)(CI)(IO)(F)
                                      OFFICE\PPotts:(OI)(CI)(NP)(F)
                                      NT AUTHORITY\SYSTEM:(OI)(CI)(F)
                                      NT AUTHORITY\LOCAL SERVICE:(OI)(CI)(F)
                                      OFFICE\web_account:(OI)(CI)(RX,W)
                                      BUILTIN\Administrators:(OI)(CI)(F)
                                      BUILTIN\Users:(OI)(CI)(RX)

Successfully processed 1 files; Failed processing 0 files
```

```console
# Check all files and directories
icacls * /C
```

```console {class="sample-code"}
PS C:\xampp\htdocs\internal> icacls * /C
icacls * /C
applications CREATOR OWNER:(OI)(CI)(IO)(F)
             OFFICE\PPotts:(OI)(CI)(NP)(F)
             NT AUTHORITY\SYSTEM:(OI)(CI)(F)
             NT AUTHORITY\LOCAL SERVICE:(OI)(CI)(F)
             OFFICE\web_account:(OI)(CI)(RX,W)
             BUILTIN\Administrators:(OI)(CI)(F)
             BUILTIN\Users:(OI)(CI)(RX)

css NT AUTHORITY\LOCAL SERVICE:(I)(OI)(CI)(F)
    OFFICE\web_account:(I)(OI)(CI)(RX)
    NT AUTHORITY\SYSTEM:(I)(OI)(CI)(F)
    BUILTIN\Administrators:(I)(OI)(CI)(F)
    BUILTIN\Users:(I)(OI)(CI)(RX)
    CREATOR OWNER:(I)(OI)(CI)(IO)(F)

img NT AUTHORITY\LOCAL SERVICE:(I)(OI)(CI)(F)
    OFFICE\web_account:(I)(OI)(CI)(RX)
    NT AUTHORITY\SYSTEM:(I)(OI)(CI)(F)
    BUILTIN\Administrators:(I)(OI)(CI)(F)
    BUILTIN\Users:(I)(OI)(CI)(RX)
    CREATOR OWNER:(I)(OI)(CI)(IO)(F)

index.html NT AUTHORITY\LOCAL SERVICE:(I)(F)
           OFFICE\web_account:(I)(RX)
           NT AUTHORITY\SYSTEM:(I)(F)
           BUILTIN\Administrators:(I)(F)
           BUILTIN\Users:(I)(RX)

resume.php NT AUTHORITY\LOCAL SERVICE:(I)(F)
           OFFICE\web_account:(I)(RX)
           NT AUTHORITY\SYSTEM:(I)(F)
           BUILTIN\Administrators:(I)(F)
           BUILTIN\Users:(I)(RX)
           OFFICE\PPotts:(I)(F)

Successfully processed 5 files; Failed processing 0 files
```

{{< /tabcontent >}}

#### Grant user full control

{{< tab set2 tab1 >}}cmd{{< /tab >}}
{{< tab set2 tab2 >}}powershell{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# cmd
cmd.exe /c cacls <FILE> /E /G <USER>:F
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# powershell
icacls <FILE> /grant <USER>:F
```

{{< /tabcontent >}}

#### Change owner (WO)

{{< tab set3 tab1 >}}cmd{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
# cmd
cmd.exe /c takeown /F <FILE>
```

{{< /tabcontent >}}
<br>

{{< tab set4 tab1 >}}ACLs{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
+---------------------------------------------------+
| F    (full access)                                |
| M    (modify access)                              |
| RX   (read and execute access)                    |
| R    (read-only access)                           |
| W    (write-only access)                          |
| D    (delete)                                     |
| RC   (read control)                               |
| WDAC (write DAC)                                  |
| WO   (write owner)                                |
| S    (synchronize)                                |
| AS   (access system security)                     |
| MA   (maximum allowed)                            |
| GR   (generic read)                               |
| GW   (generic write)                              |
| GE   (generic execute)                            |
| GA   (generic all)                                |
| RD   (read data/list directory)                   |
| WD   (write data/add file)                        |
| AD   (append data/add subdirectory)               |
| REA  (read extended attributes)                   |
| WEA  (write extended attributes)                  |
| X    (execute/traverse)                           |
| DC   (delete child)                               |
| RA   (read attributes)                            |
| WA   (write attributes)                           |
| OI   (object inherit)                             |
| CI   (container inherit)                          |
| IO   (inherit only)                               |
| NP   (do not propagate inherit)                   |
| I    (permission inherited from parent container) |
+---------------------------------------------------+
```

{{< /tabcontent >}}
