---
title: "Python Decompile"
date: 2024-7-12
tags: ["python", "pyc", "decompile", "uncompyle6", "reversing", "pyinstxtractor"]
---

---
### Tools

{{< tab set1 tab1 active >}}pyinstxtractor{{< /tab >}}
{{< tab set1 tab2 >}}uncompyle6{{< /tab >}}
{{< tab set1 tab3 >}}pycdc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Unpack pyinstaller packed binary
pyinstxtractor test.elf
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Install
pip3 install uncompyle6
```

```bash
# Run (need .pyc extension)
uncompyle6 script.pyc
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
# Install
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

```bash
# Run
./pycdc script.pyc
```

</div>

<small>*Ref: [pycdc](https://github.com/zrax/pycdc)*</small>

{{< /tabcontent >}}

<br>