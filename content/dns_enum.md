---
title: "DNS Enum"
date: 2024-6-26
tags: ["dns", "dig", "reconnaissance", "domain", "enum"]
---

---
### Zone Transfer

```bash
dig +noall +answer example.com axfr @10.10.11.10
```

### Domain Discovery

```bash
dig +noall +answer @10.10.11.10 example.com
```

```bash
dig +noall +answer @10.10.11.10 -x 10.10.11.10
```

```bash
dig +noall +answer @10.10.11.10 +short example.com any
```

```bash
dig +noall +answer @10.10.11.10 -t NS example.com
```

<br>