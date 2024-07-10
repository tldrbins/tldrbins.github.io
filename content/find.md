---
title: "Find"
date: 2024-6-29
tags: ["find", "linux", "file system", "enum", "suid", "locate"]
---

---
### Locate a file

```bash
locate cmd.php
```

### Find files of type file

```bash
find . -type f
```

### Find and Open

```bash
find / -name test.txt -exec cat {} \;
```

### Find SUID bit set files

```bash
find / -type f -user root \( -perm -4000 -o -perm -2000 \) 2>/dev/null -ls
```

### Find files owned by group

```bash
find / -group adm 2>/dev/null | grep -v -e ^/proc
```

### Find files created between 1/1/2024 and 31/12/2024

```bash
find / -type f -newermt 2024-01-01 ! -newermt 2024-12-31 -ls 2>/dev/null
```

### Find files with capabilities

```bash
find / -exec getcap {} \; 2>/dev/null
```

### Find writable folders

```bash
find . -type d | while read dir; do mkdir ${dir}/test 2>/dev/null && echo "${dir} - directory create OK" && rmdir ${dir}/test; touch ${dir}/test 2>/dev/null && echo "${dir} - file write OK" && rm ${dir}/test; done
```

<br>