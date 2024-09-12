---
title: "Python Decompile"
date: 2024-7-12
tags: ["python", "pyc", "decompile", "uncompyle6", "reversing", "pyinstxtractor"]
---

### Tools

{{< tab set1 tab1 active >}}pyinstxtractor{{< /tab >}}
{{< tab set1 tab2 >}}uncompyle6{{< /tab >}}
{{< tab set1 tab3 >}}pycdc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Unpack pyinstaller packed binary
pyinstxtractor <FILE>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# Install
pip3 install uncompyle6
```

```console
# Run (need .pyc extension)
uncompyle6 <PYC_FILE>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```console
# Install
git clone https://github.com/zrax/pycdc.git
```

```console
cd pycdc
```

```console
cmake .
```

```console
make
```

```console
make check
```

```console
# Run
./pycdc <PYC_FILE>
```

</div>

<small>*Ref: [pycdc](https://github.com/zrax/pycdc)*</small>

{{< /tabcontent >}}

<br>