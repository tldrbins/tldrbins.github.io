---
title: "GPG"
date: 2025-7-25
tags: ["Cryptography", "Encryption", "File Encryption", "Gpg", "Pretty Good Privacy", "Public Key", "Private Key"]
---

### General

```console
# Check version
gpg --version
```

```console
# Generate new key
gpg --gen-key
```

```console
# Export private key
gpg --homedir <GNUPG_DIR> --export-secret-keys --armor > key.asc
```

```console
# Export public key
gpg --export -a <USER>@<DOMAIN>
```

```console
# Check keys
gpg --list-keys
```

```console
# Import public key
gpg --import <PUB_KEY>
```

```console
# Encrypt a message with public key (Email from pubKey)
gpg --encrypt --armor -r <USER>@<DOMAIN> <FILE>
```

```console
# Decrypt a message with our private key
gpg --homedir <GNUPG_DIR> -d <ENC_FILE>
```

```console
# Sign our own message
gpg --clearsign --output - <FILE>
```

