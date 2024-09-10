---
title: "Wordpress"
date: 2024-6-28
tags: ["wordpress", "wpscan"]
---

---
### Default config location

<div>

```bash
/var/www/html/wp-config.php
```

</div>

### Tools

{{< tab set1 tab1 active >}}wpscan{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# HTTP
wpscan --url http://example.com -e ap,t,tt,u
```

```bash
# HTTPS
wpscan --url http://example.com -e ap,t,tt,u --disable-tls-checks
```

```bash
# You will need an api token to scan vulns
wpscan --url http://example.com -e ap,t,tt,u --api-token <API_KEY>
```

```bash
# Brute force wp-admin
wpscan --url http://example.com --passwords passwords.txt --usernames admin
```

</div>

<small>*Ref: [Get Free API key](https://wpscan.com/)*</small>

{{< /tabcontent >}}

<br>