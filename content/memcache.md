---
title: "memcache"
date: 2024-7-17
tags: ["memcache", "telnet"]
---

---
### Connect 

#### Using Telnet

```bash
# Connect
telnet 127.0.0.1 11211
```

#### Using memcached-cli

```bash
# Install
sudo npm install -g memcached-cli
```

```bash
# Connect (With Creds)
memcached-cli <USER>:<PASSWORD>@10.10.11.10:11211
```

### Basic Commmands

```bash
# Info about slabs
stats slabs
```

```bash
# Show slab info (e.g. slab 1 and display all keys)
stats cachedump 1 0
```

```bash
# Dump info
get <ITEM_NAME>
```

<br>
