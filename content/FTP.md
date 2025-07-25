---
title: "FTP"
date: 2025-7-25
tags: ["Lftp", "Ftp", "File Transfer"]
---

### Config Location

```console
/etc/vsftpd.conf
```

### General

```console
# Anonymous
ftp ftp://anonymous:@<TARGET>
```

```console
# Password
ftp ftp://<USER>:<PASSWORD>@<TARGET>
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
get "<FILE>"
```

```console
# Upload
put "<FILE>"
```

```console
# Connect over tunnel
passive
```

```console
# Exit
quit
```

### Recusive download

```console
# Anonymous
wget -r ftp://anonymous:@<TARGET>
```

```console
# Password
wget --user <USER> --password '<PASSWORD>' -m ftp://<TARGET>
```

<small>*Note: Always check what's in there first*</small>
