---
title: "Listeners"
date: 2024-6-26
tags: ["listener", "revshell", "nc", "pwncat"]
---

### Listener Tools

{{< tab set1 tab1 active >}}nc{{< /tab >}}
{{< tab set1 tab2 >}}ncat{{< /tab >}}
{{< tab set1 tab3 >}}pwncat{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
rlwrap nc -lvnp <LOCAL_PORT>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Default listening on both ipv4 and ipv6
rlwrap ncat -lvnp <LOCAL_PORT>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
pwncat-cs -lp <LOCAL_PORT>
```

```console
# After getting a connection
back
```

<small>*Ref: [pwncat](https://github.com/calebstewart/pwncat)*</small>

{{< /tabcontent >}}
