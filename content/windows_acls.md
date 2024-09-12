---
title: "Windows ACLs"
date: 2024-6-28
tags: ["icacls", "acl", "Windows", "access control lists", "powershell", "cmd"]
---

### Window ACLs (Access Control Lists)

#### Check ACLs

{{< tab set1 tab1 active >}}powershell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Check a file/directory
icacls <PATH>
```

```console
# Check all files and directories
icacls * /C
```

</div>

{{< /tabcontent >}}

#### Grant user full control

{{< tab set2 tab1 active >}}cmd{{< /tab >}}
{{< tab set2 tab2 >}}powershell{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```console
# cmd
cmd.exe /c cacls <FILE> /E /G <USER>:F
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```console
# powershell
icacls <FILE> /grant <USER>:F
```

</div>

{{< /tabcontent >}}

#### Change owner (WO)

{{< tab set3 tab1 active >}}cmd{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

```console
# cmd
cmd.exe /c takeown /F <FILE>
```

</div>

{{< /tabcontent >}}
<br>

{{< tab set4 tab1 active >}}ACLs{{< /tab >}}
{{< tabcontent set4 tab1 >}}

<div>

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

</div>

{{< /tabcontent >}}

<br>