---
title: "Webdav"
date: 2024-6-28
tags: ["webdav", "http", "web"]
---

### Tools
{{< tab set1 tab1 active >}}davtest{{< /tab >}}
{{< tab set1 tab2 >}}curl{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Without creds
davtest -url http://<TARGET>
```

```console
# With creds
davtest -url http://<TARGET> -auth '<USER>:<PASSWORD>'
```

<small>*Ref: [Download davtest](https://github.com/cldrn/davtest)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Rename a remote file
curl -X MOVE -H 'Destination:http://<TARGET>/<NEW_FILENAME>' http://<TARGET>/<FILE>
```

{{< /tabcontent >}}
