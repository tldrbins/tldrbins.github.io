---
title: "Kubelet"
date: 2024-7-27
tags: ["Kubelet", "Kubernetes", "Container", "RCE"]
---

### Basic Commands

```console
# List all the pods on the node
kubeletctl pods -s <TARGET>
```

```console
# List running pods
kubeletctl runningpods -s <TARGET>
```

```console
# Exec command
kubeletctl exec "/bin/bash" -p <POD_NAME> -c <CONTAINER_NAME> -s <TARGET>
```

<small>*Ref: [kubeletctl](https://github.com/cyberark/kubeletctl)*</small>
