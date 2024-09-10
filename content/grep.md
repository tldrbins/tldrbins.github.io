---
title: "Grep"
date: 2024-7-10
tags: ["grep", "regex", "strings"]
---

---
#### Basic

<div>

```bash
grep 'text' file.txt
```

</div>

#### Grep from files recursively (e.g from current directory)

<div>

```bash
grep -rni 'text' .
```

</div>

#### Grep from binary

<div>

```bash
grep -a 'text' binary
```

</div>

#### Grep hash from binary with perl regex

<div>

```bash
grep -aPo '[a-fA-F0-9]{32}' binary
```

</div>

#### Grep from binaries recusively (e.g. from /var/log)

<div>

```bash
sudo grep -rHa "password" /var/log
```

</div>

#### Find unique char of a file

<div>

```bash
cat file.txt | od -cvA none -w1 | sort -bu | tr -d '\n' | tr -d ' '
```

</div>

<br>
