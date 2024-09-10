---
title: "Finger Protocol"
date: 2024-7-5
tags: ["finger", "file transfer"]
---

---
### Basic

<div>

```bash
# Check logged in users
finger @10.10.11.10
```

```bash
# Check valid user
finger <USER>@10.10.11.10
```

</div>

### Brute force usernames

<div>

```bash
perl finger-user-enum.pl -U /usr/share/seclists/Usernames/Names/names.txt -t 10.10.11.10
```

</div>

<small>*Ref: [finger-user-enum](https://raw.githubusercontent.com/pentestmonkey/finger-user-enum/master/finger-user-enum.pl)*</small>

<br>