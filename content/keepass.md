---
title: "Keepass"
date: 2024-7-3
tags: ["keepass", "kpcli", "password", "kdbx"]
---

---
### Master password cracking

<div>

```bash
keepass2john key.kdbx > hash
```

```bash
# With a key file
keepass2john -k key.png key.kdbx > hash
```

</div>

### kpcli

<div>

```bash
# Open kdbx
kpcli --kdb key.kdbx
```

```bash
# Open kdbx with a key file
kpcli --key key.png --kdb key.kdbx
```

```bash
# List all passwords
find .
```

```bash
# Show password (e.g. #0)
show -f 0
```

```bash
# Export attachment (e.g. #0)
attach 0
```

</div>

<small>*Ref: [Download kpcli](https://github.com/rebkwok/kpcli)*</small>

<br>