---
title: "Webdav"
date: 2024-6-28
tags: ["webdav", "http", "web"]
---

---
### Tools
{{< tab set1 tab1 active >}}davtest{{< /tab >}}
{{< tab set1 tab2 >}}curl{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Without creds
davtest -url http://example.com
```

```bash
# With creds
davtest -url http://example.com -auth <USER>:<PASSWORD>
```

</div>

<small>*Ref: [Download davtest](https://github.com/cldrn/davtest)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Rename a remote file
curl -X MOVE -H 'Destination:http://example.com/test.php' http://example.com/test.txt
```

</div>

{{< /tabcontent >}}

<br>