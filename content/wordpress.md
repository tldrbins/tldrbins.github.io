---
title: "Wordpress"
date: 2024-6-28
tags: ["wordpress", "wpscan"]
---

---
### wpscan

[Get Free API key](https://wpscan.com/)

```bash
# HTTP
wpscan --url http://example.com -e ap,t,tt,u

# HTTPS
wpscan --url http://example.com -e ap,t,tt,u --disable-tls-checks

# You will need an api token to scan vulns
wpscan --url http://example.com -e ap,t,tt,u --api-token API_KEY

# Brute force wp-admin
wpscan --url http://example.com --passwords passwords.txt --usernames admin
```

<br>