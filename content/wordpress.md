---
title: "Wordpress"
date: 2024-6-28
tags: ["Wpscan", "Wordpress", "Reconnaissance", "Enumeration"]
---

#### Default Config Location

```console
/var/www/html/wp-config.php
```

{{< tab set1 tab1 >}}wpscan{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# HTTP
wpscan --url <TARGET> -e ap,t,tt,u
```

```console
# HTTPS
wpscan --url <TARGET> -e ap,t,tt,u --disable-tls-checks
```

```console
# Scan vulns
wpscan --url <TARGET> -e ap,t,tt,u --api-token <API_KEY>
```

```console
# Brute-force wp-admin
wpscan --url <TARGET> --passwords <WORDLIST> --usernames admin
```

<small>*Ref: [Wpscan API key](https://wpscan.com/)*</small>

{{< /tabcontent >}}
