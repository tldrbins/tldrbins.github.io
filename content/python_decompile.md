---
title: "Python Decompile"
date: 2024-7-12
tags: ["python", "pyc", "decompile", "uncompyle6", "reversing", "pyinstxtractor"]
---

---
### pyinstxtractor

```bash
# Unpack pyinstaller packed binary
pyinstxtractor test.elf
```

### uncompyle6

```bash
# Install
pip3 install uncompyle6
```

```bash
# Run (need .pyc extension)
uncompyle6 script.pyc
```

### pycdc

#### Installation

[pycdc](https://github.com/zrax/pycdc)

```bash
git clone https://github.com/zrax/pycdc.git
```

```bash
cd pycdc
```

```bash
cmake .
```

```bash
make
```

```bash
make check
```

#### Run

```bash
./pycdc script.pyc
```

<br>