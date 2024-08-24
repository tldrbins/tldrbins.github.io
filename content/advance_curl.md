---
title: "Curl"
date: 2024-6-26
tags: ["curl", "http", "file transfer", "web"]
---

---
### Advance curl

```bash
# POST url-encoded data
curl --data-urlencode 'cmd=ping -c3 10.10.14.10' http://example.com/cmd.php
```

```bash
# Put the POST data to url and use GET
curl -G --data-urlencode 'cmd=ping -c3 10.10.14.10' http://example.com/cmd.php
```

```bash
# PUT a file
curl -X PUT http://example.com/example.txt -d @example.txt
```

```bash
# PUT a file (with creds)
curl -X PUT http://<USER>:<PASSWORD>@example.com/example.txt -d @example.txt
```

```bash
# Put a file as raw binary format (preserve newlines and control characters)
curl -X PUT http://example.com/example.txt --data-binary @example.aspx
```

```bash
# POST a file with form param 'file'
curl -X POST -F "file=@example.php;type=application/php;filename=example.php" http://example.com/upload
```

```bash
# POST a file in raw-text format (not as attachment) with form param 'file'
curl -X POST -F 'file=<example.zip' http://example.com/upload
```

```bash
# Not to handle sequences of '/../' or '/./' in the given URL
curl --path-as-is --ignore-content-length http://example.com/../../../../etc/passwd
```

```bash
# Save the same name as the file on the server
curl http://example.com/example.txt -O
```

<br>