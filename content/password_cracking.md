---
title: "Password Cracking"
date: 2024-6-27
tags: ["password", "cracking", "john", "hashcat"]
---

---
### Convert file to hash format

<div>

```bash
# For example
ssh2john id_rsa_encrypted > hash
```

```bash
keepass2john test.kdbx > hash
```

```bash
zip2john test.zip > hash
```

```bash
# Get a full list of *2john
find / -name *2john 2>/dev/null
```

</div>

<br>

---

{{< tab set1 tab1 active >}}john{{< /tab >}}
{{< tab set1 tab2 >}}hashcat{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# General use
john --wordlist=/usr/share/wordlists/rockyou.txt hash
```

```bash
# Specify hash format
john --wordlist=/usr/share/wordlists/rockyou.txt hash --format=Raw-SHA512
```

```bash
# Show cracked hash
john --show hash
```

```bash
# Show cracked hash with specific format
john --show hash --format=Raw-SHA512
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Auto detect hash format
hashcat hash
```

```bash
# Specify hash format
hashcat -m 13400 -a 0 hash /usr/share/wordlists/rockyou.txt --force
```

```bash
# Auto skip username and colon
hashcat hash --user
```

</div>

#### Create a wordlist

<div>

```bash
# For example, `Test` with 4 digits and a symbol
hashcat --stdout -a 3 Test?d?d?d?d?s > passwords.txt
```

</div>

<br>

<div>

```
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

</div>

<small>*Ref: [Example Hashes](https://hashcat.net/wiki/doku.php?id=example_hashes)*</small>

{{< /tabcontent >}}

<br>