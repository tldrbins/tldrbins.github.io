---
title: "Listeners"
date: 2024-6-26
tags: ["listener", "revshell", "nc", "pwncat"]
---

---
### nc

```bash
rlwrap nc -lvnp 1337
```

### ncat 

```bash
# Default listening on both ipv4 and ipv6
rlwrap ncat -lvnp 1337
```

### pwncat

<small>[Download pwncat](https://github.com/calebstewart/pwncat)</small>

```bash
pwncat-cs -lp 1337
```

```bash
# After getting a connection
(local) pwncat$ back
```

<br>