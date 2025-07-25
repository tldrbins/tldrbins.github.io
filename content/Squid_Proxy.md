---
title: "Squid Proxy"
date: 2025-7-25
tags: ["Port Scanning", "Enumeration", "Squid Proxy", "Web", "Proxy"]
---

### Config Location

```console
/etc/squid/squid.conf
```

### Connect via FoxyProxy Firefox Plugin

```console
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

<br>

```console
# Connect
http://<TARGET>
```

```console
# Or
http://127.0.0.1
```

### Internal Ports Scan via Proxy

```console
# 1. Take note of word size, then Ctrl+C
wfuzz -z range,1-1000 -p <TARGET>:3128:HTTP -u http://127.0.0.1:FUZZ
```

```console
# 2. Re-run with word size filter
wfuzz -z range,1-65535 -p <TARGET>:3128:HTTP -u http://127.0.0.1:FUZZ --hw 100
```

### Connect to Internal Services

```console
# Edit /etc/proxychains4.conf
# Settings
[ProxyList]
http    <TARGET> 3128
```

<br>

```console
# Connect, e.g. ssh
proxychains4 ssh <USER>@127.0.0.1
```

### Squid Cache Enum

{{< tab set1 tab1 >}}squidclient{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
squidclient -U squid -W '<PASSWORD>' -h <TARGET> cache_object://<TARGET>/
```

{{< /tabcontent >}}
