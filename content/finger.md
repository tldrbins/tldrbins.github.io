---
title: "Finger Protocol"
date: 2024-7-5
tags: ["finger", "file transfer", "79"]
---

---
### Basic

```bash
# Check logged in users
finger @10.10.11.10
```

```bash
# Check valid user
finger <USER>@10.10.11.10
```

### Brute force usernames

[finger-user-enum](https://raw.githubusercontent.com/pentestmonkey/finger-user-enum/master/finger-user-enum.pl)

```bash
perl finger-user-enum.pl -U /usr/share/seclists/Usernames/Names/names.txt -t 10.10.11.10
```

<br>