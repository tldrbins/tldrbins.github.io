---
title: "Grep"
date: 2024-7-10
tags: ["grep", "regex", "strings"]
---

---
### Basic

```bash
grep 'text' file.txt
```

### Grep from files recursively (e.g from current directory)

```bash
grep -rni 'text' .
```

### Grep from binary

```bash
grep -a 'text' binary
```

### Grep hash from binary with perl regex

```bash
grep -aPo '[a-fA-F0-9]{32}' binary
```

### Grep from binaries recusively (e.g. from /var/log)

```bash
sudo grep -rHa "password" /var/log
```

### Find unique char of a file

```bash
cat file.txt | od -cvA none -w1 | sort -bu | tr -d '\n' | tr -d ' '
```

<br>
