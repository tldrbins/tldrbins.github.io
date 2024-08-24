---
title: "SSL"
date: 2024-6-28
tags: ["ssl", "sslscan"]
---

---
### sslscan

```bash
# Scan target SSL version
sslscan <TARGET>
```

### Fix Old ssl Protocol Connection Problem

```bash
# Edit /etc/ssl/openssl.cnf

[system_default_sect]
#MinProtocol = DEFAULT@SECLEVEL=2
MinProtocol = None
#CipherString = DEFAULT@SECLEVEL=2
CipherString = None
```

<small>*Note: Remember to revert the changes after job done*</small>