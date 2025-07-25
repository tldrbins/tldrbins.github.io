---
title: "Memory Dump"
date: 2024-6-29
tags: ["Forensics", "Credential Dumping", "Binwalk", "Dmp", "Memory Dump", "Reversing", "Minidump"]
---

### Tools

{{< tab set1 tab1 >}}binwalk{{< /tab >}}
{{< tab set1 tab2 >}}pypykatz{{< /tab >}}
{{< tab set1 tab3 >}}MemProcFS{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Extract files from memory dump
binwalk -M -e <MEMORY_DUMP>
```

<small>*Ref: [binwalk](https://github.com/ReFirmLabs/binwalk)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Mini dump
pypykatz lsa minidump <MEMORY_DUMP>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
./memprocfs -mount <PATH> -device <MEMORY_DUMP>
```

<small>*Ref: [MemProcFS](https://github.com/ufrisk/MemProcFS)*</small>

{{< /tabcontent >}}