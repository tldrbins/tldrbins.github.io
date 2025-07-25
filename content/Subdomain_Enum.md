---
title: "Subdomain Enum"
date: 2025-7-25
tags: ["Gobuster", "Enumeration", "Web", "Subdomain", "Wfuzz", "Http", "Hosts", "Reconnaissance", "Vhosts"]
---

### Add Domain/Subdomain to '/etc/hosts'

```console
echo "<TARGET_IP> <DOMAIN>" | sudo tee -a /etc/hosts
```

---

{{< tab set1 tab1 >}}wfuzz{{< /tab >}}
{{< tab set1 tab2 >}}gobuster{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Subdomain Enum

```console
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.<DOMAIN>" -u 'http://<DOMAIN>'
```

```console
# Take note of the word size, Ctrl+C to interrupt the process, then run again
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.<DOMAIN>" -u 'http://<DOMAIN>' --hw <WORD>
```

#### Filter Out Response with Header

```console
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Origin: http://FUZZ.<DOMAIN>" --filter "r.headers.response ~ '<HEADER>'" -u 'http://<DOMAIN>'
```

```console {class="sample-code"}
# For example: Access-Control-Allow-Origin
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Origin: http://FUZZ.<DOMAIN>" --filter "r.headers.response ~ 'Access-Control-Allow-Origin'" -u 'http://example.com'
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
gobuster vhost -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -u 'http://<DOMAIN>'
```

{{< /tabcontent >}}
