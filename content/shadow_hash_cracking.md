---
title: "Shadow Hash Cracking"
date: 2024-7-5
tags: ["password", "cracking", "john", "hashcat", "shadow", "unshadow", "passwd"]
---

---
### Shadow Hash Cracking

```bash
# Prepare an unshadowed hashes file
unshadow passwd.txt shadow.txt > unshadowed.txt
```

#### john

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt unshadowed.txt
```

#### hashcat

```bash
hashcat -m 7400 unshadowed.txt /usr/share/wordlists/rockyou.txt --force --user
```

<br>