---
title: "FTP"
date: 2024-7-4
tags: ["ftp", "file transfer", "21"]
---

---
### Config Location

```bash
/etc/vsftpd.conf
```

### Basic

```bash
# Connect
ftp 10.10.11.10
```

```bash
+---------------------+
| Anonymous login     |
+---------------------+
| Username: anonymous |
| Password: (empty)   |
+---------------------+
```

```bash
# List
ls
```

```bash
# Switch to binary transfer mode
bin
```

```bash
# Download
get <FILE>
```

```bash
# Upload
put <FILE>
```

```bash
# Connect over tunnel
passive
```

```bash
# Exit
quit
```

### Recusive download

```bash
# anonymous login
wget -r ftp://anonymous:@10.10.11.10
```

```bash
# with creds
wget --user <USER> --password <PASSWORD> -m ftp://10.10.11.10
```

<small>*Note: Always check what's in there first*</small>

