---
title: "Keepass"
date: 2024-7-3
tags: ["keepass", "kpcli", "password", "kdbx"]
---

### Master password cracking

```console
keepass2john <KDBX_FILE> > hash
```

```console
# With a key file
keepass2john -k <KEY_FILE> <KDBX_FILE> > hash
```

### kpcli

```console
# Open kdbx
kpcli --kdb <KDBX_FILE>
```

```console
# Open kdbx with a key file
kpcli --key <KEY_FILE> --kdb <KDBX_FILE>
```

```console
# List all passwords
find .
```

```console
# Show password (e.g. #0)
show -f 0
```

```console
# Export attachment (e.g. #0)
attach 0
```

<small>*Ref: [Download kpcli](https://github.com/rebkwok/kpcli)*</small>
