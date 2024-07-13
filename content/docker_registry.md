---
title: "Docker Registry"
date: 2024-7-12
tags: ["docker", "container", "docker registry", "api"]
---

---
### API

```bash
# List repos
curl -s -k --user "username:password" https://docker.example.com/v2/_catalog
```

```bash
# List of tags of this repo
curl -s -k --user "username:password" https://docker.example.com/v2/REPO_NAME/tags/list
```

```bash
# List manifest file for this tag (e.g. latest)
curl -s -k --user "username:password" https://docker.example.com/v2/REPO_NAME/manifests/latest
```

```bash
# Get a commit of the image
curl -s -k --user "username:password" https://docker.example.com/v2/REPO_NAME/blobs/sha256:BLOB_HASH'
```

<br>