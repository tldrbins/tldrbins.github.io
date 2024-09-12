---
title: "Finger Protocol"
date: 2024-7-5
tags: ["finger", "file transfer"]
---

### Basic

<div>

```console
# Check logged in users
finger @<TARGET>
```

```console
# Check valid user
finger <USER>@<TARGET>
```

</div>

### Brute force usernames

<div>

```console
perl finger-user-enum.pl -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET>
```

</div>

<small>*Ref: [finger-user-enum](https://raw.githubusercontent.com/pentestmonkey/finger-user-enum/master/finger-user-enum.pl)*</small>

<br>