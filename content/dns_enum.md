---
title: "DNS Enum"
date: 2024-6-26
tags: ["dns", "dig", "reconnaissance", "domain", "enum"]
---

---
### Zone Transfer

```bash
dig test.com axfr @10.10.11.10
```

### Domain Discovery

```bash
dig @10.10.11.10 test.com
```

<br>

```bash
dig @10.10.11.10 -x 10.10.11.10
```

<br>

```bash
dig @10.10.11.10 -x 10.10.11.10
```

<br>

```bash
dig @10.10.11.10 +short test.com any
```

<br>

```bash
dig @10.10.11.10 -t NS test.com
```

<br>

```bash
dig @10.10.11.10 _gc.test.com
```

<br>