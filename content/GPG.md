---
title: "GPG"
date: 2024-8-1
tags: ["gpg", "encryption", "crypto", "Pretty Good Privacy", "public key", "private key"]
---

---
### GPG

<div>

```bash
# Check version
gpg --version
```

```bash
# Generate new key
gpg --gen-key
```

```bash
# Export public key
gpg --export -a user@example.com
```

```bash
# Check keys
gpg --list-keys
```

```bash
# Import public key
gpg --import key.pub
```

```bash
# Encrypt a message with public key (email from pub key)
gpg --encrypt --armor -r user@example.com plaintext.txt
```

```bash
# Decrypt a message with our private key
gpg -d ciphertext.txt 
```

```bash
# Sign our own message
gpg --clearsign --output - plaintext.txt
```

</div>

<br>
