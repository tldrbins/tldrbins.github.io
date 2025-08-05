---
title: "Advance wget"
date: 2025-8-1
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

```console
# Get all files from index (Bypass slash restriction)
wget -r <TARGET> -nd
```