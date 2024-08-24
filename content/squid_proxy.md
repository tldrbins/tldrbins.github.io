---
title: "Squid Proxy"
date: 2024-7-4
tags: ["squid proxy", "web", "3128", "proxy", "port scan"]
---

---
### Config location

```bash
/etc/squid/squid.conf
```

### Connect via FoxyProxy Firefox plugin

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

```bash
# Connect
http://<TARGET>
```

```bash
# Or
http://127.0.0.1
```

### Internal ports scan via proxy

```bash
# 1. Take note of word size, then Ctrl+C
wfuzz -z range,1-1000 -p <TARGET>:3128:HTTP -u http://127.0.0.1:FUZZ
```

```bash
# 2. Re-run with word size filter
wfuzz -z range,1-65535 -p <TARGET>:3128:HTTP -u http://127.0.0.1:FUZZ --hw 100
```

### Connect to internal services

```bash
# Edit
/etc/proxychains4.conf
```

```bash
# Settings
[ProxyList]
http    <TARGET> 3128
```

```bash
# Connect, e.g. ssh
proxychains4 ssh <USER>@127.0.0.1
```

### Squid Cache Enum

```bash
squidclient -U squid -W <PASSWORD> -h <TARGET> cache_object://<TARGET>/
```

<br>
