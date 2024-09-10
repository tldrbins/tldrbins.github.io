---
title: "Docker Registry"
date: 2024-7-12
tags: ["docker", "container", "docker registry", "api"]
---

---
### Docker Registry API

<div>

```bash
# List repos
curl -s -k --user "<USER>:<PASSWORD>" https://docker.example.com/v2/_catalog
```

```bash
# List of tags of this repo
curl -s -k --user "<USER>:<PASSWORD>" https://docker.example.com/v2/<REPO_NAME>/tags/list
```

```bash
# List manifest file for this tag (e.g. latest)
curl -s -k --user "<USER>:<PASSWORD>" https://docker.example.com/v2/<REPO_NAME>/manifests/latest
```

```bash
# Get a commit of the image
curl -s -k --user "<USER>:<PASSWORD>" https://docker.example.com/v2/<REPO_NAME>/blobs/sha256:<BLOB_HASH>'
```

</div>

<br>

---

### Docker Registry Dump

{{< tab set1 tab1 active >}}DockerRegistryGrabber{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# List repos
python3 drg.py https://example.com -A <TOKEN> --list
```

```bash
# Dump repo
python3 drg.py https://example.com -A <TOKEN> --dump <REPO>
```

</div>

<small>*Ref: [DockerRegistryGrabber](https://github.com/Syzik/DockerRegistryGrabber)*</small>

{{< /tabcontent >}}

<br>