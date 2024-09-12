---
title: "Memory Dump"
date: 2024-6-29
tags: ["dmp", "memory dump", "binwalk", "reversing", "forensic", "minidump"]
---

### Tools

{{< tab set1 tab1 active >}}binwalk{{< /tab >}}
{{< tab set1 tab2 >}}pypykatz{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Extract files from memory dump
binwalk -M -e <MEMORY_DUMP>
```

</div>

<small>*Ref: [binwalk](https://github.com/ReFirmLabs/binwalk)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# Mini Dump
pypykatz lsa minidump <MEMORY_DUMP>
```

</div>

{{< /tabcontent >}}

<br>