---
title: "Advance curl"
date: 2024-6-26
tags: ["curl", "http", "file transfer", "web"]
---

### Advance curl

<div>

```console
# POST url-encoded data
curl --data-urlencode '<QUERY_STRING>' <TARGET>
```

```console
# Put the POST data to url and use GET
curl -G --data-urlencode '<QUERY_STRING>' <TARGET>
```

```console
# PUT a file
curl -X PUT <TARGET>/<FILE> -d @<FILE>
```

```console
# PUT a file (with creds)
curl -X PUT http://<USER>:<PASSWORD>@<DOMAIN>/<FILE> -d @<FILE>
```

```console
# Put a file as raw binary format (preserve newlines and control characters)
curl -X PUT <TARGET>/<FILE> --data-binary @<FILE>
```

```console
# POST a file with form param 'file'
curl -X POST -F 'file=@<FILE>p;type=<APPLICATION_TYPE>;filename=<FILE>' <TARGET>
```

```console
# POST a file in raw-text format (not as attachment) with form param 'file'
curl -X POST -F 'file=<<FILE>' <TARGET>
```

```console
# Not to handle sequences of '/../' or '/./' in the given URL
curl --path-as-is --ignore-content-length '<TARGET>/../../../..<FILE_PATH>'
```

```console
# Save the same name as the file on the server
curl <TARGET>/<FILE> -O
```

</div>

<br>