---
title: "Listeners"
date: 2024-6-26
tags: ["listener", "revshell", "nc", "pwncat"]
---

---
### Listener Tools

{{< tab set1 tab1 active >}}nc{{< /tab >}}
{{< tab set1 tab2 >}}ncat{{< /tab >}}
{{< tab set1 tab3 >}}pwncat{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
rlwrap nc -lvnp 1337
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Default listening on both ipv4 and ipv6
rlwrap ncat -lvnp 1337
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
pwncat-cs -lp 1337
```

```bash
# After getting a connection
(local) pwncat$ back
```

</div>

<small>*Ref: [pwncat](https://github.com/calebstewart/pwncat)*</small>

{{< /tabcontent >}}

<br>