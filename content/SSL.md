---
title: "SSL"
date: 2025-7-25
tags: ["Ssl", "Sslscan", "Reconnaissance"]
---

### Tools

{{< tab set1 tab1 >}}sslscan{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Scan target SSL version
sslscan <TARGET>
```

{{< /tabcontent >}}

### Fix Old SSL Protocol Connection Problem

```console
# Edit /etc/ssl/openssl.cnf

[system_default_sect]
#MinProtocol = DEFAULT@SECLEVEL=2
MinProtocol = None
#CipherString = DEFAULT@SECLEVEL=2
CipherString = None
```

<small>*Note: Remember to revert the changes after job done*</small>
