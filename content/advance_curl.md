---
title: "Curl"
date: 2024-6-26
tags: ["curl", "http", "file transfer", "web"]
---

---
### Advance curl

```bash
# PUT request with a file
curl -X PUT http://example.com/test.txt -d @test.txt

# Upload as binary (preserve newlines and control characters)
curl -X PUT http://example.com/test.txt --data-binary @test.aspx

# POST request with with form param `file`
curl -X POST -F "file=@shell.php;type=application/php;filename=shell.php" 'http://example.com/upload'
```

<br>