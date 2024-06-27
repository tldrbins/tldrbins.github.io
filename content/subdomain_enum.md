---
title: "Subdomain Enum"
date: 2024-6-26
tags: ["web", "domain", "subdomain", "wfuzz", "http", "enum"]
---

---
### wfuzz

[download wfuzz](https://github.com/xmendez/wfuzz)

```bash
# HTTP
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.example.com" -u http://example.com

# HTTPS
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.example.com" -u https://example.com -k
```

##### Take note of the word size, Ctrl+C to interrupt the process, then run again

```bash
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.example.com" -u http://example.com --hw 10
```

<br>