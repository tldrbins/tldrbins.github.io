---
title: "Wordpress"
date: 2024-6-28
tags: ["wordpress", "wpscan"]
---

---
### wpscan

[Download wpscan](https://wpscan.com/)

```bash
wpscan --url http://10.10.11.10 -e ap,t,tt,u

# You will need an api token to scan vulns
wpscan --url http://10.10.11.10 -e ap,t,tt,u --api-token API_KEY
```

<br>