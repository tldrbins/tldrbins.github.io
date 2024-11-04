---
title: "Password Cracking"
date: 2024-6-27
tags: ["Hash Cracking", "Password Cracking", "File Encryption", "John The Ripper", "Hashcat", "Wordlist", "Generate"]
---

### Convert file to hash format

```console
# For example
ssh2john id_rsa_encrypted > hash
```

```console
keepass2john test.kdbx > hash
```

```console
zip2john test.zip > hash
```

```console
# Get a full list of *2john
find / -name *2john 2>/dev/null
```

---

{{< tab set1 tab1 >}}john{{< /tab >}}
{{< tab set1 tab2 >}}hashcat{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# General use
john --wordlist=/usr/share/wordlists/rockyou.txt hash
```

```console
# Specify hash format
john --wordlist=/usr/share/wordlists/rockyou.txt hash --format=Raw-SHA512
```

```console
# Show cracked hash
john --show hash
```

```console
# Show cracked hash with specific format
john --show hash --format=Raw-SHA512
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Auto detect hash format
hashcat hash
```

```console
# Specify hash format
hashcat -m 13400 -a 0 hash /usr/share/wordlists/rockyou.txt --force
```

```console
# Auto skip username and colon
hashcat hash --user
```

#### Create a wordlist

```console
# For example, 'Test' with 4 digits and a symbol
hashcat --stdout -a 3 Test?d?d?d?d?s > passwords.txt
```

```console {class="sample-code"}
$ hashcat --stdout -a 3 Test?d?d?d?d?s > passwords.txt
$ head passwords.txt 
Test1999*
Test2312.
Test5678*
Test0000.
Test9000.
Test8888*
Test3000.
Test4523.
Test7778*
Test6999*
```

<br>

```console
+------------------------------------------+
|  ? | Charset                             |
| ===+=========                            |
|  l | abcdefghijklmnopqrstuvwxyz [a-z]    |
|  u | ABCDEFGHIJKLMNOPQRSTUVWXYZ [A-Z]    |
|  d | 0123456789                 [0-9]    |
|  h | 0123456789abcdef           [0-9a-f] |
|  H | 0123456789ABCDEF           [0-9A-F] |
|  s |  !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~   |
|  a | ?l?u?d?s                            |
|  b | 0x00 - 0xff                         |
+-----------------------------------------+
```

<small>*Ref: [Example Hashes](https://hashcat.net/wiki/doku.php?id=example_hashes)*</small>

{{< /tabcontent >}}
