---
title: "Wordpress"
date: 2024-6-28
tags: ["wordpress", "wpscan"]
---

### Default config location

```console
/var/www/html/wp-config.php
```

### Tools

{{< tab set1 tab1 active >}}wpscan{{< /tab >}}
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
# You will need an api token to scan vulns
wpscan --url <TARGET> -e ap,t,tt,u --api-token <API_KEY>
```

```console
# Brute force wp-admin
wpscan --url <TARGET> --passwords passwords.txt --usernames admin
```

<small>*Ref: [Get Free API key](https://wpscan.com/)*</small>

{{< /tabcontent >}}
