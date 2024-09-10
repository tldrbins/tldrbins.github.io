---
title: "Squid Proxy"
date: 2024-7-4
tags: ["squid proxy", "web", "3128", "proxy", "port scan"]
---

---
### Config location

<div>

```bash
/etc/squid/squid.conf
```

</div>

### Connect via FoxyProxy Firefox plugin

<div>

```bash
+--------------------------+
| Settings                 |
+--------------------------+
| Title      : squid proxy |
| Proxy Type : HTTP        |
| Proxy IP   : <TARGET>    |
| Port       : 3128        |
| Username   : (If any)    |
| Password   : (If any)    |
+--------------------------+
```

</div>

<br>

<div>

```bash
# Connect
http://<TARGET>
```

```bash
# Or
http://127.0.0.1
```

</div>

### Internal ports scan via proxy

<div>

```bash
# 1. Take note of word size, then Ctrl+C
wfuzz -z range,1-1000 -p <TARGET>:3128:HTTP -u http://127.0.0.1:FUZZ
```

```bash
# 2. Re-run with word size filter
wfuzz -z range,1-65535 -p <TARGET>:3128:HTTP -u http://127.0.0.1:FUZZ --hw 100
```

</div>

### Connect to internal services

<div>

```bash
# Edit /etc/proxychains4.conf
# Settings
[ProxyList]
http    <TARGET> 3128
```

</div>

<br>

<div>

```bash
# Connect, e.g. ssh
proxychains4 ssh <USER>@127.0.0.1
```

</div>

### Squid Cache Enum

{{< tab set1 tab1 active >}}squidclient{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```bash
squidclient -U squid -W <PASSWORD> -h <TARGET> cache_object://<TARGET>/
```

{{< /tabcontent >}}

<br>
