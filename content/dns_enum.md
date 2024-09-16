---
title: "DNS Enum"
date: 2024-6-26
tags: ["dns", "dig", "reconnaissance", "domain", "enum"]
---

### Zone Transfer

```console
dig +noall +answer <DOMAIN> axfr @<TARGET>
```

### Domain Discovery

```console
dig +noall +answer @<TARGET> <DOMAIN>
```

```console
dig +noall +answer @<TARGET> -x <TARGET>
```

```console
dig +noall +answer @<TARGET> +short <DOMAIN> any
```

```console
dig +noall +answer @<TARGET> -t NS <DOMAIN>
```
