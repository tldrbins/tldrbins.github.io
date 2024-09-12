---
title: "Shadow Hash Cracking"
date: 2024-7-5
tags: ["password", "cracking", "john", "hashcat", "shadow", "unshadow", "passwd"]
---

### Shadow Hash Cracking

<div>

```console
# Prepare an unshadowed hashes file
unshadow passwd.txt shadow.txt > unshadowed.txt
```

</div>

{{< tab set1 tab1 active >}}john{{< /tab >}}
{{< tab set1 tab2 >}}hashcat{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
john --wordlist=/usr/share/wordlists/rockyou.txt unshadowed.txt
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
hashcat -m 7400 unshadowed.txt /usr/share/wordlists/rockyou.txt --force --user
```

</div>

{{< /tabcontent >}}

<br>