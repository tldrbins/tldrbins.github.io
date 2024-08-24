---
title: "Subdomain Enum"
date: 2024-6-26
tags: ["web", "domain", "subdomain", "wfuzz", "http", "enum", "hosts"]
---

---
### wfuzz

[download wfuzz](https://github.com/xmendez/wfuzz)

```bash
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.example.com" -u http://example.com
```

##### Take note of the word size, Ctrl+C to interrupt the process, then run again

```bash
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.example.com" -u http://example.com --hw 10
```

#### Filter out response with header

```bash
# For example: Access-Control-Allow-Origin
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Origin: http://FUZZ.example.com" --filter "r.headers.response ~ 'Access-Control-Allow-Origin'" -u http://example.com
```

<br>

---

### gobuster

```bash
gobuster vhost -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -u http://example.com
```

<br>

---

### Add domain/subdomain to /etc/hosts

```bash
echo "10.10.11.10 example.com" | sudo tee -a /etc/hosts
```

<br>