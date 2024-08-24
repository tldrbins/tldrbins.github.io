---
title: "Memory Dump"
date: 2024-6-29
tags: ["dmp", "memory dump", "binwalk", "reversing", "forensic", "minidump"]
---

---
### binwalk

[Download binwalk](https://github.com/ReFirmLabs/binwalk)

```bash
# Extract files from memory dump
binwalk -M -e memory.dmp
```

### Mini Dump

```bash
pypykatz lsa minidump memory.dmp
```

<br>