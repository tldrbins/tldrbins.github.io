---
title: "Wordpress"
date: 2024-6-28
tags: ["wordpress", "wpscan"]
---

---
### wpscan

[Download wpscan](https://wpscan.com/)

```bash
# HTTP
wpscan --url http://10.10.11.10 -e ap,t,tt,u

# HTTPS
wpscan --url https://10.10.11.10 -e ap,t,tt,u --disable-tls-checks

# You will need an api token to scan vulns
wpscan --url http://10.10.11.10 -e ap,t,tt,u --api-token API_KEY
```

<br>