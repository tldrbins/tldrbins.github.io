---
title: "DNS Enum"
date: 2024-6-26
tags: ["dns", "dig", "reconnaissance", "domain", "enum"]
---

### Zone Transfer

<div>

```console
dig +noall +answer <DOMAIN> axfr @<TARGET>
```

</div>

### Domain Discovery

<div>

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

</div>

<br>