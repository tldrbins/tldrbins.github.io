---
title: "memcache"
date: 2024-7-17
tags: ["Memcache", "Telnet", "Database Dumping"]
---

### Connect

{{< tab set1 tab1 >}}telnet{{< /tab >}}
{{< tab set1 tab2 >}}memcached-cli{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Connect
telnet 127.0.0.1 11211
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Install
sudo npm install -g memcached-cli
```

```console
# Connect (With Creds)
memcached-cli '<USER>:<PASSWORD>@<TARGET>:11211'
```

{{< /tabcontent >}}

### Basic Commmands

```console
# Info about slabs
stats slabs
```

```console
# Show slab info (e.g. slab 1 and display all keys)
stats cachedump 1 0
```

```console
# Dump info
get <ITEM_NAME>
```
