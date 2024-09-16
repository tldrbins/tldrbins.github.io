---
title: "AD Recycle Bin"
date: 2024-7-13
tags: ["ad recycle bin", "active driectory", "ad", "Windows"]
---

### Privesc #1: Restore deleted AD account

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import AD module

```console
import-module activedirectory
```

#### 2. Query all deleted objects within domain

```console
Get-ADObject -filter 'isDeleted -eq $true -and name -ne "Deleted Objects"' -includeDeletedObjects
```

#### 3. Get all details for the deleted account

```console
Get-ADObject -filter { SAMAccountName -eq <DELETED_USER> } -includeDeletedObjects -property *
```

#### 4. Restore the deleted account

```console
# Rename the target account to avoid user exists error
Restore-ADObject -Identity <OBJECT_GUID> -NewName '<NEW_USER>' -TargetPath 'CN=Users,DC=<EXAMPLE>,DC=<COM>'
```

{{< /tabcontent >}}
