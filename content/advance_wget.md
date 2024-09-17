---
title: "Advance wget"
date: 2024-7-5
tags: ["Wget", "Http File Transfer", "File Transfer", "Http"]
---

### Advance wget

```console
# Provide a file with urls
wget --input-file <FILE_PATH>
```

```console
# POST a file
wget --post-file <FILE_PATH> <TARGET>
```

```console
# Overwrite a file
wget <TARGET>/<FILE> -O <FILE_PATH>
```
