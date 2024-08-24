---
title: "Password Cracking"
date: 2024-6-27
tags: ["password", "cracking", "john", "hashcat"]
---

---
### john

#### Convert file to john hash format

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

#### Basic

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

<br>

---

### hashcat

[Example Hashes](https://hashcat.net/wiki/doku.php?id=example_hashes)

#### Basic

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

#### Create a wordlist

```bash
# For example, `Test` with 4 digits and a symbol
hashcat --stdout -a 3 Test?d?d?d?d?s > passwords.txt
```

<br>

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

<br>