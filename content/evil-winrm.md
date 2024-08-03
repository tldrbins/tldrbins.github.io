---
title: "evil-winrm"
date: 2024-7-27
tags: ["evil-winrm", "remote", "Windows"]
---

---
### Connect by password

```bash
evil-winrm -i 127.0.0.1 -u username -p password
```

### Connect by hash

```bash
evil-winrm -i 10.10.11.10 -u username -H <HASH> 
```

### Connect by kerberos

```bash
sudo ntpdate -s 10.10.11.10 && evil-winrm -i dc.example.com -r EXAMPLE.COM
```

### Connect by .crt and .key

```bash
evil-winrm -i example.com -S -k auth.key -c auth.crt
```

<br>