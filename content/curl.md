---
title: "curl"
date: 2025-7-16
tags: ["Path Traversal", "Curl", "Http File Transfer", "Http", "File Transfer", "CRUD", "API"]
---

{{< tab set1 tab1 >}}curl{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Show Header Only
curl -I <TARGET>
```

```console
# Save as the Same Name as the File on the Server
curl <TARGET>/<FILE> -O
```

```console
# GET Url-encoded Query
curl -G --data-urlencode '<QUERY_STRING>' <TARGET>
```

```console
# POST Url-encoded Data
curl --data-urlencode '<DATA>' <TARGET>
```

```console
# PUT a File
curl -X PUT <TARGET>/<FILE> -d @<FILE>
```

```console
# PUT a File (Authenticate)
curl -X PUT -u '<USER>:<PASSWORD>' <TARGET>/<FILE> -d @<FILE>
```

```console
# PUT a File as Raw Binary (Preserve Newlines and Control Characters)
curl -X PUT <TARGET>/<FILE> --data-binary @<FILE>
```

```console
# POST a File with Form Param
curl -X POST -F '<PARAM>=@<FILE>;type=<APPLICATION_TYPE>;filename=<FILE>' <TARGET>
```

```console
# POST a File in Raw-text Format (Not as Attachment)
curl -X POST -F '<PARAM>=<<FILE>' <TARGET>
```

```console
# Not to Handle Sequences of '/../' or '/./'
curl --path-as-is --ignore-content-length '<TARGET>/../../../..<FILE_PATH>'
```

{{< /tabcontent >}}