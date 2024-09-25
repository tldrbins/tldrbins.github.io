---
title: "Windows RPC"
date: 2024-7-21
tags: ["Impacket", "Windows RPC", "Windows", "COM", "Enumeration"]
---

### Windows RPC

{{< tab set1 tab1 active >}}impacket{{< /tab >}}
{{< tab set1 tab2 >}}IOXIDResolver{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Show mappings
impacket-rpcmap 'ncacn_ip_tcp:<TARGET>'
```

```console {class="sample-code"}
$ impacket-rpcmap 'ncacn_ip_tcp:10.10.10.213'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

...[SNIP]...

Protocol: [MS-DCOM]: Distributed Component Object Model (DCOM) Remote
Provider: rpcss.dll
UUID: 99FCFEC4-5260-101B-BBCB-00AA0021347A v0.0

...[SNIP]...
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Get network interface without auth
python3 IOXIDResolver.py -t <TARGET>
```

```console {class="sample-code"}
$ python3 IOXIDResolver.py -t 10.10.10.213
[*] Retrieving network interface of 10.10.10.213
Address: apt
Address: 10.10.10.213
Address: dead:beef::b885:d62a:d679:573f
```

<small>*Ref: [IOXIDResolver](https://github.com/mubix/IOXIDResolver)*</small>

{{< /tabcontent >}}
