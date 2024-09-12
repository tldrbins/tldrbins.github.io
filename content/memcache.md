---
title: "memcache"
date: 2024-7-17
tags: ["memcache", "telnet"]
---

### Connect

{{< tab set1 tab1 active >}}telnet{{< /tab >}}
{{< tab set1 tab2 >}}memcached-cli{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Connect
telnet 127.0.0.1 11211
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# Install
sudo npm install -g memcached-cli
```

```console
# Connect (With Creds)
memcached-cli '<USER>:<PASSWORD>@<TARGET>:11211'
```

</div>

{{< /tabcontent >}}

### Basic Commmands

<div>

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

</div>

<br>
