---
title: "Subdomain Enum"
date: 2024-6-26
tags: ["web", "domain", "subdomain", "wfuzz", "http", "enum", "hosts"]
---

---
### Add domain/subdomain to /etc/hosts

<div>

```bash
echo "10.10.11.10 example.com" | sudo tee -a /etc/hosts
```

</div>

<br>

---

{{< tab set1 tab1 active >}}wfuzz{{< /tab >}}
{{< tab set1 tab2 >}}gobuster{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.example.com" -u http://example.com
```

</div>

#### Take note of the word size, Ctrl+C to interrupt the process, then run again

<div>

```bash
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.example.com" -u http://example.com --hw 10
```

</div>

#### Filter out response with header

<div>

```bash
# For example: Access-Control-Allow-Origin
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Origin: http://FUZZ.example.com" --filter "r.headers.response ~ 'Access-Control-Allow-Origin'" -u http://example.com
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
gobuster vhost -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -u http://example.com
```

</div>

{{< /tabcontent >}}

<br>