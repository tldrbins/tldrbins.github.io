---
title: "Wordpress"
date: 2024-6-28
tags: ["wordpress", "wpscan"]
---

---
### Default config location

```bash
/var/www/html/wp-config.php
```

### wpscan

[Get Free API key](https://wpscan.com/)

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

<br>