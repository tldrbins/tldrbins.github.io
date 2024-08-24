---
title: "evil-winrm"
date: 2024-7-27
tags: ["evil-winrm", "remote", "Windows"]
---

---
### Connect by password

```bash
evil-winrm -i <TARGET> -u <USER> -p <PASSWORD>
```

### Connect by hash

```bash
evil-winrm -i <TARGET> -u <USER> -H <HASH> 
```

### Connect by kerberos

```bash
sudo ntpdate -s <DC> && evil-winrm -i <TARGET> -r <DOMAIN>
```

### Connect by .crt and .key

```bash
evil-winrm -i <TARGET> -S -k auth.key -c auth.crt
```

<br>