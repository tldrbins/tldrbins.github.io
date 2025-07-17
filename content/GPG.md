---
title: "GPG"
date: 2024-8-1
tags: ["Cryptography", "Encryption", "File Encryption", "Gpg", "Pretty Good Privacy", "Public Key", "Private Key"]
---

### Basic

```console
# Check Version
gpg --version
```

```console
# Generate New Key
gpg --gen-key
```

```console
# Export Private Key
gpg --homedir <GNUPG_DIR> --export-secret-keys --armor > key.asc
```

```console
# Export Public Key
gpg --export -a <USER>@<DOMAIN>
```

```console
# Check Keys
gpg --list-keys
```

```console
# Import Public Key
gpg --import <PUB_KEY>
```

```console
# Encrypt a Message with Public Key (Email from PubKey)
gpg --encrypt --armor -r <USER>@<DOMAIN> <FILE>
```

```console
# Decrypt a Message with Our Private Key
gpg --homedir <GNUPG_DIR> -d <ENC_FILE>
```

```console
# Sign Our Own Message
gpg --clearsign --output - <FILE>
```

