---
title: "Kubelet"
date: 2024-7-27
tags: ["Kubelet", "Kubernetes", "container"]
---

---
### Tools

[kubeletctl](https://github.com/cyberark/kubeletctl)

### Basic Commands

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
kubeletctl exec "/bin/bash" -p pod_name -c container_name -s 10.10.11.10
```


<br>