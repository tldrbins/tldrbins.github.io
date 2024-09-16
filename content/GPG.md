---
title: "GPG"
date: 2024-8-1
tags: ["gpg", "encryption", "crypto", "Pretty Good Privacy", "public key", "private key"]
---

### GPG

```console
# Check version
gpg --version
```

```console
# Generate new key
gpg --gen-key
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
# Encrypt a message with public key (email from pub key)
gpg --encrypt --armor -r <USER>@<DOMAIN> <FILE>
```

```console
# Decrypt a message with our private key
gpg -d <ENC_FILE>
```

```console
# Sign our own message
gpg --clearsign --output - <FILE>
```

