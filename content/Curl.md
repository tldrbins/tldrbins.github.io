---
title: "curl"
date: 2025-7-25
tags: ["Path Traversal", "Curl", "Http File Transfer", "Http", "File Transfer", "CRUD", "API"]
---

{{< tab set1 tab1 >}}curl{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Show header only
curl -I <TARGET>
```

```console
# Save as the same name as the file on the server
curl <TARGET>/<FILE> -O
```

```console
# GET url-encoded query
curl -G --data-urlencode '<QUERY_STRING>' <TARGET>
```

```console
# POST url-encoded data
curl --data-urlencode '<DATA>' <TARGET>
```

```console
# PUT a file
curl -X PUT <TARGET>/<FILE> -d @<FILE>
```

```console
# PUT a file (Authenticate)
curl -X PUT -u '<USER>:<PASSWORD>' <TARGET>/<FILE> -d @<FILE>
```

```console
# PUT a file as raw binary (Preserve newlines and control characters)
curl -X PUT <TARGET>/<FILE> --data-binary @<FILE>
```

```console
# POST a file with form param
curl -X POST -F '<PARAM>=@<FILE>;type=<APPLICATION_TYPE>;filename=<FILE>' <TARGET>
```

```console
# POST a file in raw-text format (Not as attachment)
curl -X POST -F '<PARAM>=<<FILE>' <TARGET>
```

```console
# Not to handle sequences of '/../' or '/./'
curl --path-as-is --ignore-content-length '<TARGET>/../../../..<FILE_PATH>'
```

{{< /tabcontent >}}