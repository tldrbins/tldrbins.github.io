---
title: "FTP"
date: 2024-7-4
tags: ["ftp", "file transfer"]
---

### Config Location

<div>

```console
/etc/vsftpd.conf
```

</div>

### Basic

<div>

```console
# Connect
ftp <TARGET>
```

```console
+---------------------+
| Anonymous login     |
+---------------------+
| Username: anonymous |
| Password: (empty)   |
+---------------------+
```

```console
# Over SSL
lftp <TARGET>
```

```console
# Fix cert error
echo -n 'set ssl:verify-certificate no' >> ~/.lftp/rc
```

```console
# List
ls
```

```console
# Switch to binary transfer mode
bin
```

```console
# Download
get <FILE>
```

```console
# Upload
put <FILE>
```

```console
# Connect over tunnel
passive
```

```console
# Exit
quit
```

</div>

### Recusive download

<div>

```console
# anonymous login
wget -r ftp://anonymous:@<TARGET>
```

```console
# with creds
wget --user <USER> --password '<PASSWORD>' -m ftp://<TARGET>
```

<small>*Note: Always check what's in there first*</small>

</div>

<br>