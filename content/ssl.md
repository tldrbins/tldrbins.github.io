---
title: "SSL"
date: 2024-6-28
tags: ["ssl", "sslscan"]
---

---
### Tools

{{< tab set1 tab1 active >}}sslscan{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Scan target SSL version
sslscan <TARGET>
```

</div>

{{< /tabcontent >}}

### Fix old ssl protocol connection problem

<div>

```bash
# Edit /etc/ssl/openssl.cnf

[system_default_sect]
#MinProtocol = DEFAULT@SECLEVEL=2
MinProtocol = None
#CipherString = DEFAULT@SECLEVEL=2
CipherString = None
```

</div>

<small>*Note: Remember to revert the changes after job done*</small>

<br>