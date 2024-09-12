---
title: "Windows RPC"
date: 2024-7-21
tags: ["Windows RPC", "Windows", "COM", "135"]
---

### Windows RPC

{{< tab set1 tab1 active >}}impacket{{< /tab >}}
{{< tab set1 tab2 >}}IOXIDResolver{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Show mappings
impacket-rpcmap 'ncacn_ip_tcp:<TARGET>'
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# Get network interface without auth
python3 IOXIDResolver.py -t <TARGET>
```

</div>

<small>*Ref: [IOXIDResolver](https://github.com/mubix/IOXIDResolver)*</small>

{{< /tabcontent >}}

<br>