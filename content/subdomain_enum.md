---
title: "Subdomain Enum"
date: 2024-6-26
tags: ["web", "domain", "subdomain", "wfuzz", "http", "enum", "hosts"]
---

### Add domain/subdomain to /etc/hosts

<div>

```console
echo "<TARGET> <DOMAIN>" | sudo tee -a /etc/hosts
```

</div>

<br>

---

{{< tab set1 tab1 active >}}wfuzz{{< /tab >}}
{{< tab set1 tab2 >}}gobuster{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.<DOMAIN>" -u http://<DOMAIN>
```

</div>

#### Take note of the word size, Ctrl+C to interrupt the process, then run again

<div>

```console
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Host: FUZZ.<DOMAIN>" -u http://<DOMAIN> --hw 10
```

</div>

#### Filter out response with header

<div>

```console
# For example: Access-Control-Allow-Origin
wfuzz -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -H "Origin: http://FUZZ.<DOMAIN>" --filter "r.headers.response ~ 'Access-Control-Allow-Origin'" -u http://<DOMAIN>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
gobuster vhost -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt -u http://<DOMAIN>
```

</div>

{{< /tabcontent >}}

<br>