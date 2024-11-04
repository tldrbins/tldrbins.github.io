---
title: "Shadow Hash Cracking"
date: 2024-7-5
tags: ["Password Cracking", "Hash Cracking", "John The Ripper", "Hashcat", "shadow", "Unshadow", "passwd"]
---

### Shadow Hash Cracking

```console
# Prepare an unshadowed hashes file
unshadow passwd.txt shadow.txt > unshadowed.txt
```

{{< tab set1 tab1 >}}john{{< /tab >}}
{{< tab set1 tab2 >}}hashcat{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
john --wordlist=/usr/share/wordlists/rockyou.txt unshadowed.txt
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
hashcat -m 7400 unshadowed.txt /usr/share/wordlists/rockyou.txt --force --user
```

{{< /tabcontent >}}
