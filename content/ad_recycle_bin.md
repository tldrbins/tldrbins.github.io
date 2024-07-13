---
title: "AD Recycle Bin"
date: 2024-7-13
tags: ["ad recycle bin", "active driectory", "ad", "Windows"]
---

---
### AD Recycle Bin

```powershell
import-module activedirectory
```

```powershell
# Query all deleted objects within domain
Get-ADObject -filter 'isDeleted -eq $true -and name -ne "Deleted Objects"' -includeDeletedObjects
```

```powershell
# Get all details for the deleted account (e.g. TempAdmin)
Get-ADObject -filter { SAMAccountName -eq "TempAdmin" } -includeDeletedObjects -property *
```

```powershell
# Restore deleted account (Need to rename to avoid user exist)
Restore-ADObject -Identity ObjectGUID -NewName "new_user" -TargetPath "CN=Users,DC=example,DC=com"
```

<br>