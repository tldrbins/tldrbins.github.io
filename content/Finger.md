---
title: "Finger Protocol"
date: 2025-7-25
tags: ["Enumeration", "Finger", "File Transfer"]
---

### General

```console
# Check logged in users
finger @<TARGET>
```

```console
# Check valid user
finger <USER>@<TARGET>
```

### Brute Force Usernames

```console
perl finger-user-enum.pl -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET>
```

<small>*Ref: [finger-user-enum](https://raw.githubusercontent.com/pentestmonkey/finger-user-enum/master/finger-user-enum.pl)*</small>
