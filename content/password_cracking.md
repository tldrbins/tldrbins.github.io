---
title: "Password Cracking"
date: 2024-6-27
tags: ["password", "cracking", "john", "hashcat"]
---

---
### john

[Download john](https://github.com/openwall/john)

#### Convert file to john hash format

```bash
# For example
ssh2john id_rsa_encrypted > hash
keepass2john test.kdbx > hash
zip2john test.zip > hash

# Get a full list of *2john
find / -name *2john 2>/dev/null
```

#### Crack with john

```bash
# General use
john --wordlist=/usr/share/wordlists/rockyou.txt hash

# Specify hash format
john --wordlist=/usr/share/wordlists/rockyou.txt hash --format=Raw-SHA512

# Show cracked hash
john --show hash

# Show cracked hash with specific format
john --show hash --format=Raw-SHA512
```

<br>

---

### hashcat

```bash
# Auto detect hash format
hashcat hash

# Specify hash format
hashcat -m 13400 -a 0 hash /usr/share/wordlists/rockyou.txt --force
```

#### Create a wordlist

```
  ? | Charset
 ===+=========
  l | abcdefghijklmnopqrstuvwxyz [a-z]
  u | ABCDEFGHIJKLMNOPQRSTUVWXYZ [A-Z]
  d | 0123456789                 [0-9]
  h | 0123456789abcdef           [0-9a-f]
  H | 0123456789ABCDEF           [0-9A-F]
  s |  !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
  a | ?l?u?d?s
  b | 0x00 - 0xff
```

```bash
# For example, Test with 4 digit and a symbol
hashcat --stdout -a 3 Test?d?d?d?d?s > passwords.txt
```

<br>