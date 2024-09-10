---
title: "memcache"
date: 2024-7-17
tags: ["memcache", "telnet"]
---

---
### Connect

{{< tab set1 tab1 active >}}telnet{{< /tab >}}
{{< tab set1 tab2 >}}memcached-cli{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Connect
telnet 127.0.0.1 11211
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Install
sudo npm install -g memcached-cli
```

```bash
# Connect (With Creds)
memcached-cli <USER>:<PASSWORD>@10.10.11.10:11211
```

</div>

{{< /tabcontent >}}

### Basic Commmands

<div>

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

</div>

<br>
