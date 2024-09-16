---
title: "Docker Registry"
date: 2024-7-12
tags: ["docker", "container", "docker registry", "api"]
---

### Docker Registry API

```console
# List repos
curl -s -k --user "<USER>:<PASSWORD>" <TARGET>/v2/_catalog
```

```console
# List of tags of this repo
curl -s -k --user "<USER>:<PASSWORD>" <TARGET>/v2/<REPO_NAME>/tags/list
```

```console
# List manifest file for this tag (e.g. latest)
curl -s -k --user "<USER>:<PASSWORD>" <TARGET>/v2/<REPO_NAME>/manifests/latest
```

```console
# Get a commit of the image
curl -s -k --user "<USER>:<PASSWORD>" <TARGET>/v2/<REPO_NAME>/blobs/sha256:<BLOB_HASH>'
```

---

### Docker Registry Dump

{{< tab set1 tab1 active >}}DockerRegistryGrabber{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# List repos
python3 drg.py <TARGET> -A <TOKEN> --list
```

```console
# Dump repo
python3 drg.py <TARGET> -A <TOKEN> --dump <REPO>
```

<small>*Ref: [DockerRegistryGrabber](https://github.com/Syzik/DockerRegistryGrabber)*</small>

{{< /tabcontent >}}
