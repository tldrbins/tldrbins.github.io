---
title: "Memory Dump"
date: 2024-6-29
tags: ["dmp", "memory dump", "binwalk", "reversing", "forensic", "minidump"]
---

---
### Tools

{{< tab set1 tab1 active >}}binwalk{{< /tab >}}
{{< tab set1 tab2 >}}pypykatz{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Extract files from memory dump
binwalk -M -e memory.dmp
```

</div>

<small>*Ref: [binwalk](https://github.com/ReFirmLabs/binwalk)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Mini Dump
pypykatz lsa minidump memory.dmp
```

</div>

{{< /tabcontent >}}

<br>