---
title: "Electron"
date: 2024-7-22
tags: ["Web Exploitation", "Electron", "Web"]
---

### Tools

```console
sudo npm -g install asar
```

### Unpack app.asar

```console
# List files
asar l <FILE>
```

```console
# Extract all files
asar e <FILE>
```

```console
# Extract a file
asar ef <FILE> main.js
```
