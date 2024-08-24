---
title: "Windows ACLs"
date: 2024-6-28
tags: ["icacls", "acl", "Windows", "access control lists", "powershell", "cmd"]
---

---
### Window ACLs (Access Control Lists)

#### Check ACLs

```powershell
# Check a file/directory
icacls <PATH>
```

```powershell
# Check all files and directories
icacls * /C
```

#### Grant user full control

```powershell
# cmd
cmd.exe /c cacls <FILE> /E /G <USER>:F
```

```powershell
# powershell
icacls <FILE> /grant <USER>:F
```

#### Change owner (WO)

```powershell
# cmd
cmd.exe /c takeown /F <FILE>
```

<br>

```bash
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

<br>