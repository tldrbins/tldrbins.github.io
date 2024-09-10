---
title: "Kubelet"
date: 2024-7-27
tags: ["Kubelet", "Kubernetes", "container"]
---

---
### Basic Commands

<div>

```bash
# List all the pods on the node
kubeletctl pods -s 10.10.11.10
```

```bash
# List running pods
kubeletctl runningpods -s 10.10.11.10
```

```bash
# Exec command
kubeletctl exec "/bin/bash" -p <POD_NAME> -c <CONTAINER_NAME> -s 10.10.11.10
```

</div>

<small>*Ref: [kubeletctl](https://github.com/cyberark/kubeletctl)*</small>


<br>