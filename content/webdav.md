---
title: "Webdav"
date: 2024-6-28
tags: ["webdav", "http", "web"]
---

---
### davtest

[Download davtest](https://github.com/cldrn/davtest)

```bash
# Without creds
davtest -url http://10.10.11.10
```

```bash
# With creds
davtest -url http://10.10.11.10 -auth user:password
```

### curl

```bash
# Rename a remote file
curl -X MOVE -H 'Destination:http://example.com/test.php' http://example.com/test.txt
```

<br>