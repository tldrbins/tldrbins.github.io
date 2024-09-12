---
title: "Keepass"
date: 2024-7-3
tags: ["keepass", "kpcli", "password", "kdbx"]
---

### Master password cracking

<div>

```console
keepass2john <KDBX> > hash
```

```console
# With a key file
keepass2john -k <KEY_FILE> <KDBX> > hash
```

</div>

### kpcli

<div>

```console
# Open kdbx
kpcli --kdb <KDBX>
```

```console
# Open kdbx with a key file
kpcli --key <KEY_FILE> --kdb <KDBX>
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

</div>

<small>*Ref: [Download kpcli](https://github.com/rebkwok/kpcli)*</small>

<br>