---
title: "Keepass"
date: 2025-7-17
tags: ["Password Cracking", "Hash Cracking", "Keepass", "Kpcli", "Password", "Kdbx"]
---

### Crack Master Password

```console
keepass2john <KDBX_FILE> > hash
```

```console
# With a key file
keepass2john -k <KEY_FILE> <KDBX_FILE> > hash
```

### Basic

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

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

{{< /tabcontent >}}