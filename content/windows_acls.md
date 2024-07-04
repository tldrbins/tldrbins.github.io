---
title: "Windows ACLs"
date: 2024-6-28
tags: ["icacls", "acl", "Windows", "access control lists"]
---

---
### Window ACLs (Access Control Lists)

#### Check ACLs

```cmd
icacls "C:\Users\User"
```

#### Grant user full control

```cmd
icacls file_name /grant user:F
```

<br>

```bash
+-------------------------------------------------+
|F    (full access)                               |
|M    (modify access)                             |
|RX   (read and execute access)                   |
|R    (read-only access)                          |
|W    (write-only access)                         |
|D    (delete)                                    |
|RC   (read control)                              |
|WDAC (write DAC)                                 |
|WO   (write owner)                               |
|S    (synchronize)                               |
|AS   (access system security)                    |
|MA   (maximum allowed)                           |
|GR   (generic read)                              |
|GW   (generic write)                             |
|GE   (generic execute)                           |
|GA   (generic all)                               |
|RD   (read data/list directory)                  |
|WD   (write data/add file)                       |
|AD   (append data/add subdirectory)              |
|REA  (read extended attributes)                  |
|WEA  (write extended attributes)                 |
|X    (execute/traverse)                          |
|DC   (delete child)                              |
|RA   (read attributes)                           |
|WA   (write attributes)                          |
|OI   (object inherit)                            |
|CI   (container inherit)                         |
|IO   (inherit only)                              |
|NP   (do not propagate inherit)                  |
|I    (permission inherited from parent container)|
+-------------------------------------------------+
```

<br>